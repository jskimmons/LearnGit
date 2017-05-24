package com.talenteck.security;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talenteck.persistence.dao.RoleRepository;
import com.talenteck.persistence.dao.UserRepository;
import com.talenteck.persistence.model.Privilege;
import com.talenteck.persistence.model.Role;
import com.talenteck.persistence.model.User;

@Service("userDetailsService")
@Transactional
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private LoginAttemptService loginAttemptService;

    @Autowired
    private HttpServletRequest request;

    public MyUserDetailsService() {
        super();
    }

    // API

    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        final String ip = request.getRemoteAddr();
        boolean isCredentialsNonExpired=true;
        if (loginAttemptService.isBlocked(ip)) {
            throw new RuntimeException("blocked");
        }
        try {
            final User user = userRepository.findByEmail(email);           
            if (user == null) {
               // return new org.springframework.security.core.userdetails.User(" ", " ", true, true, true, true, getAuthorities(Arrays.asList(roleRepository.findByName("ROLE_USER"))));
            	return new MyUserDetails (" ", " ", true, true, true, true," ", getAuthorities(Arrays.asList(roleRepository.findByName("ROLE_USER"))));

            }           
            
            SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd");
            if(user.getPasswordExpirydate()!=null)
                isCredentialsNonExpired=(user.getPasswordExpirydate().compareTo(ft.parse(ft.format(new Date()))))<=0?false:true;
            return new MyUserDetails(user.getEmail(), user.getPassword(), user.isEnabled(), true, isCredentialsNonExpired, true,user.getDatabasee(), getAuthorities(user.getRoles()));
            //return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.isEnabled(), true, isCredentialsNonExpired, true, getAuthorities(user.getRoles()));
        } catch (final Exception e) {
            throw new RuntimeException(e);
        }
    }

    // UTIL

    public final Collection<? extends GrantedAuthority> getAuthorities(final Collection<Role> roles) {
        return getGrantedAuthorities(getPrivileges(roles));
    }

    private final List<String> getPrivileges(final Collection<Role> roles) {
        final List<String> privileges = new ArrayList<String>();
        final List<Privilege> collection = new ArrayList<Privilege>();
        for (final Role role : roles) {
            collection.addAll(role.getPrivileges());
        }
        for (final Privilege item : collection) {
            privileges.add(item.getName());
        }
        return privileges;
    }

    private final List<GrantedAuthority> getGrantedAuthorities(final List<String> privileges) {
        final List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        for (final String privilege : privileges) {
            authorities.add(new SimpleGrantedAuthority(privilege));
        }
        return authorities;
    }

}
