package com.talenteck.persistence.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talenteck.persistence.dao.PasswordResetTokenRepository;
import com.talenteck.persistence.dao.RoleRepository;
import com.talenteck.persistence.dao.UserRepository;
import com.talenteck.persistence.dao.VerificationTokenRepository;
import com.talenteck.persistence.model.PasswordResetToken;
import com.talenteck.persistence.model.User;
import com.talenteck.persistence.model.VerificationToken;
import com.talenteck.validation.EmailExistsException;

@SuppressWarnings("deprecation")
@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    // API

    @Override
    public User registerNewUserAccount(final UserDto accountDto) throws EmailExistsException {
        final User user = new User();
            if (emailExist(accountDto.getEmail())) {
                throw new EmailExistsException("There is an account with that email adress: " + accountDto.getEmail());
            }
        	
        user.setEmail(accountDto.getEmail());
        user.setPassword(passwordEncoder.encodePassword(accountDto.getPassword(),accountDto.getEmail()));
       
        Calendar cal = Calendar.getInstance();
        Date today = cal.getTime();
        cal.add(Calendar.YEAR, 1);
        Date nextYear=cal.getTime();
    
        user.setCreatedDate(today);
        user.setUpdatedDate(today);

        cal.add(Calendar.YEAR, 1); 
        user.setPasswordExpirydate(nextYear);
        
        user.setFirstName(accountDto.getFirstName());
        user.setMiddleName(accountDto.getMiddleName());
        user.setLastName(accountDto.getLastName());
        
        user.setWorkCompany(accountDto.getWorkCompany());
        user.setWorkLocation(accountDto.getWorkLocation());
        user.setWorkTitle(accountDto.getWorkTitle());
   
        user.setInternationalCode(accountDto.getInternationalCode());
        user.setPhoneNumber(accountDto.getPhoneNumber());
        user.setPhoneType(accountDto.getPhoneType());
        user.setRoles(Arrays.asList(roleRepository.findByName("NEW_USER")));
        user.setDatabasee(null);
        return repository.save(user);
    }
    
    
    public void updateUserAccount(final UserDto updatedUser) {
        final User user = new User();    
        user.setId(updatedUser.getId());
        user.setEmail(updatedUser.getEmail());
        user.setCreatedDate(toDate(updatedUser.getCreatedDate()));
        user.setEnabled(updatedUser.isEnabled());
        user.setDatabasee(updatedUser.getDatabasee());
        
        
        user.setFirstName(updatedUser.getFirstName());
        user.setMiddleName(updatedUser.getMiddleName());
        user.setLastName(updatedUser.getLastName());
        
        user.setPassword(updatedUser.getPassword());
        user.setPasswordExpirydate(toDate(updatedUser.getPasswordExpirydate()));

        user.setInternationalCode(updatedUser.getInternationalCode());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setPhoneType(updatedUser.getPhoneType());
       
        Calendar cal = Calendar.getInstance();
        Date today = cal.getTime();    
        user.setUpdatedDate(today);
       
        user.setWorkCompany(updatedUser.getWorkCompany());
        user.setWorkLocation(updatedUser.getWorkLocation());
        user.setWorkTitle(updatedUser.getWorkTitle());
        user.setRoles(updatedUser.getRoles());
        repository.save(user);
    }

    private Date toDate(String sdate) {
    	SimpleDateFormat fromFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");

    	Date date = null;
    	try {
			date =fromFormat.parse(sdate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}


	@Override
    public User getUser(final String verificationToken) {
        final User user = tokenRepository.findByToken(verificationToken).getUser();
        return user;
    }

    @Override
    public VerificationToken getVerificationToken(final String VerificationToken) {
        return tokenRepository.findByToken(VerificationToken);
    }

    @Override
    public VerificationToken getVerificationTokenByUser(final User user) {
        return tokenRepository.findByUser(user);
    }
    @Override
    public void saveRegisteredUser(final User user) {
        repository.save(user);
    }

    @Override
    public void deleteUser(final long id) {
    	User user = repository.findById(id);
        repository.delete(user);
    }

    @Override
    public void createVerificationTokenForUser(final User user, final String token) {
        final VerificationToken myToken = new VerificationToken(token, user);
        tokenRepository.save(myToken);
    }

    @Override
    public VerificationToken generateNewVerificationToken(final String existingVerificationToken) {
        VerificationToken vToken = tokenRepository.findByToken(existingVerificationToken);
        vToken.updateToken(UUID.randomUUID().toString());
        vToken = tokenRepository.save(vToken);
        return vToken;
    }

    @Override
    public void createPasswordResetTokenForUser(final User user, final String token) {
        final PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordTokenRepository.save(myToken);
    }

    @Override
    public User findUserByEmail(final String email) {
        return repository.findByEmail(email);
    }

    @Override
    public PasswordResetToken getPasswordResetToken(final String token) {
        return passwordTokenRepository.findByToken(token);
    }

    @Override
    public User getUserByPasswordResetToken(final String token) {
        return passwordTokenRepository.findByToken(token).getUser();
    }

    @Override
    public User getUserByID(final long id) {
        return repository.findOne(id);
    }

    @Override
    public void changeUserPassword(final User user, final String password) {
        user.setPassword(passwordEncoder.encodePassword(password,user.getEmail()));
        repository.save(user);
    }

    @Override
    public boolean checkIfValidOldPassword(final User user, final String rawPassword) {
        return passwordEncoder.isPasswordValid(rawPassword, user.getPassword(), user.getEmail());
    }

    private boolean emailExist(final String email) {
        final User user = repository.findByEmail(email);
        if (user != null) {
            return true;
        }
        return false;
    }

	@Override
	public List<User> getAllUsers() {
		return repository.findAll();
	}


}