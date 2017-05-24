package com.talenteck.security;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.talenteck.ttanalytics.DatabaseReference;

@Component("myAuthenticationSuccessHandler")

public class MySimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        handle(request, response, authentication);
        final HttpSession session = request.getSession(false);
        if (session != null) {
            session.setMaxInactiveInterval(30 * 60);
        }
        clearAuthenticationAttributes(request);
    }

    protected void handle(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        final String targetUrl = determineTargetUrl(authentication);
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }
        request.getSession(true).setAttribute("role",authentication.getAuthorities());
        request.getSession(true).setAttribute("database",((MyUserDetails)authentication.getPrincipal()).getDatabase());
        request.getSession(true).setAttribute("email",((MyUserDetails)authentication.getPrincipal()).getUsername());

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(final Authentication authentication) {
        boolean isUser = false;
        boolean isAdmin = false;
        boolean isNewUser=false;
        boolean isAllClientUser=false;

        final Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (final GrantedAuthority grantedAuthority : authorities) {
            
        	if (grantedAuthority.getAuthority().equals("NO_PRIVILEGE")) {
                isNewUser = true;            
            }else if (grantedAuthority.getAuthority().equals("WRITE_PRIVILEGE")) {
                isAdmin = true;
            }else if (grantedAuthority.getAuthority().equals("ALL_CLIENT")) {
            	isAllClientUser = true;
            }else{ isUser = true;}
        }
        if (isNewUser) {
            return "/login.html?errorMsg=NoAccess";
        }else if (isAdmin) {
           return "/admin/index.html";
        }else if (isAllClientUser) {
            return "/multiclienthome.html?user=" + authentication.getName();
        } else if (isUser) {
        	//String db = new DatabaseReference().getDBCode(((MyUserDetails)authentication.getPrincipal()).getDatabase());
            return "/analytics/landingpage.html";
        } else{
            throw new IllegalStateException();
        }
    }

    protected void clearAuthenticationAttributes(final HttpServletRequest request) {
        final HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

    public void setRedirectStrategy(final RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }

    protected RedirectStrategy getRedirectStrategy() {
        return redirectStrategy;
    }
}