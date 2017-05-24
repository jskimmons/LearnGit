package com.talenteck.web.controller;

import java.util.Calendar;
import java.util.Locale;
import java.util.Properties;
import java.util.UUID;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.talenteck.persistence.model.PasswordResetToken;
import com.talenteck.persistence.model.User;
import com.talenteck.persistence.model.VerificationToken;
import com.talenteck.persistence.service.IUserService;
import com.talenteck.persistence.service.UserDto;
import com.talenteck.registration.OnRegistrationCompleteEvent;
import com.talenteck.validation.EmailExistsException;
import com.talenteck.web.error.InvalidOldPasswordException;
import com.talenteck.web.error.UserAlreadyExistException;
import com.talenteck.web.error.UserNotFoundException;
import com.talenteck.web.util.GenericResponse;

@Controller
public class RegistrationController {
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private IUserService userService;

    @Autowired
    private MessageSource messages;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private Environment env;

    public RegistrationController() {
        super();
    }

    // Registration

    @RequestMapping(value = "/user/registration", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse registerUserAccount(@Valid final UserDto accountDto, final HttpServletRequest request) {
        LOGGER.debug("Registering user account with information: {}", accountDto);

        final User registered = createUserAccount(accountDto);
        if (registered == null) {
            throw new UserAlreadyExistException();
        }
        final String appUrl = "https://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(registered, request.getLocale(), appUrl));

        return new GenericResponse("success");
    }

    @RequestMapping(value = "/regitrationConfirm", method = RequestMethod.GET)
    public String confirmRegistration(final Locale locale, final Model model, @RequestParam("token") final String token) {
        final VerificationToken verificationToken = userService.getVerificationToken(token);
        if (verificationToken == null) {
            final String message = messages.getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        final User user = verificationToken.getUser();
        final Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            model.addAttribute("message", messages.getMessage("auth.message.expired", null, locale));
            model.addAttribute("expired", true);
            model.addAttribute("token", token);
            return "redirect:/badUser.html?lang=" + locale.getLanguage();
        }

        user.setEnabled(true);
        userService.saveRegisteredUser(user);
        model.addAttribute("message", messages.getMessage("message.accountVerified", null, locale));
        return "redirect:/login.html?lang=" + locale.getLanguage();
    }

    // user activation - verification

    @RequestMapping(value = "/user/resendRegistrationToken", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse resendRegistrationToken(final HttpServletRequest request, @RequestParam("token") final String existingToken) {
        final VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        final User user = userService.getUser(newToken.getToken());
        final String appUrl = "https://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        Message email;
        try {
            email = constructResendVerificationTokenEmail(appUrl, request.getLocale(), newToken, user);
            Transport.send(email);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        return new GenericResponse(messages.getMessage("message.resendToken", null, request.getLocale()));
    }

    //Resend Link - Registerd User only
    
    @RequestMapping(value = "/user/resendLink", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse resendLink(final HttpServletRequest request, @RequestParam("email") final String userEmail) {
        final User userExists = userService.findUserByEmail(userEmail);
        System.out.println(userExists.getFirstName());
        if(userExists!=null){
            final VerificationToken verificationToken = userService.getVerificationTokenByUser(userExists);
            if (verificationToken == null) {      
                final VerificationToken newToken = userService.generateNewVerificationToken(userEmail);
                final User user = userService.getUser(newToken.getToken());
                final String appUrl = "https://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
                Message email;
                try {
                    email = constructResendVerificationTokenEmail(appUrl, request.getLocale(), newToken, user);
                    Transport.send(email);
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            }
        }
        return new GenericResponse(messages.getMessage("message.resendToken", null, request.getLocale()));
    }
    
    
    
    // Reset password

    @RequestMapping(value = "/user/resetPassword", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse resetPassword(final HttpServletRequest request, @RequestParam("email") final String userEmail) {
        final User user = userService.findUserByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException();
        }

        final String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        final String appUrl = "https://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        Message email;
        try {
            email = constructResetTokenEmail(appUrl, request.getLocale(), token, user);
            Transport.send(email);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return new GenericResponse(messages.getMessage("message.resetPasswordEmail", null, request.getLocale()));
    }

    @RequestMapping(value = "/user/changePassword", method = RequestMethod.GET)
    public String showChangePasswordPage(final Locale locale, final Model model, @RequestParam("id") final long id, @RequestParam("token") final String token) {
        final PasswordResetToken passToken = userService.getPasswordResetToken(token);
        System.out.println(passToken);
        final User user = passToken.getUser();
        if (passToken == null || user.getId() != id) {
            final String message = messages.getMessage("auth.message.invalidToken", null, locale);
            model.addAttribute("message", message);
            return "redirect:/login.html?lang=" + locale.getLanguage();
        }

        final Calendar cal = Calendar.getInstance();
        if ((passToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            model.addAttribute("message", messages.getMessage("auth.message.expired", null, locale));
            return "redirect:/login.html?lang=" + locale.getLanguage();
        }

        final Authentication auth = new UsernamePasswordAuthenticationToken(user, null, userDetailsService.loadUserByUsername(user.getEmail()).getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        return "redirect:/updatePassword.html?lang=" + locale.getLanguage();
    }

    @RequestMapping(value = "/user/savePassword", method = RequestMethod.POST)
    @PreAuthorize("hasRole('READ_PRIVILEGE')")
    @ResponseBody
    public GenericResponse savePassword(final Locale locale, @RequestParam("password") final String password) {
        final User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.changeUserPassword(user, password);
        return new GenericResponse(messages.getMessage("message.resetPasswordSuc", null, locale));
    }

    // change user password

    @RequestMapping(value = "/user/updatePassword", method = RequestMethod.POST)
    @PreAuthorize("hasRole('READ_PRIVILEGE')")
    @ResponseBody
    public GenericResponse changeUserPassword(final Locale locale, @RequestParam("password") final String password, @RequestParam("oldpassword") final String oldPassword) {
        final User user = userService.findUserByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!userService.checkIfValidOldPassword(user, oldPassword)) {
            throw new InvalidOldPasswordException();
        }
        userService.changeUserPassword(user, password);
        return new GenericResponse(messages.getMessage("message.updatePasswordSuc", null, locale));
    }


    private final Message constructResendVerificationTokenEmail(final String contextPath, final Locale locale, final VerificationToken newToken, final User user) throws AddressException, MessagingException {
        final String confirmationUrl = contextPath + "/regitrationConfirm.html?token=" + newToken.getToken();
        final String message = messages.getMessage("message.resendToken", null, locale);
       
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", env.getProperty("smtp.host"));
        props.put("mail.smtp.port", env.getProperty("smtp.port"));
        
        final String username = env.getProperty("smtp.username");
        final String password = env.getProperty("smtp.password");
        
        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                  protected PasswordAuthentication getPasswordAuthentication() {
                      return new PasswordAuthentication(username, password);
                  }
                });

        
        final Message mailMessage = new MimeMessage(session);
        mailMessage.setFrom(new InternetAddress(env.getProperty("support.email")));
        mailMessage.setRecipients(Message.RecipientType.TO,
            InternetAddress.parse(user.getEmail()));

        
        mailMessage.setSubject("Resend Registration Token");
        mailMessage.setText(message + " \r\n" + confirmationUrl);
        return mailMessage;
    }

    private final Message constructResetTokenEmail(final String contextPath, final Locale locale, final String token, final User user) throws AddressException, MessagingException {
        final String url = contextPath + "/user/changePassword?id=" + user.getId() + "&token=" + token;
        final String message = messages.getMessage("message.resetPassword", null, locale);
        
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", env.getProperty("smtp.host"));
        props.put("mail.smtp.port", env.getProperty("smtp.port"));
        
        final String username = env.getProperty("smtp.username");
        final String password = env.getProperty("smtp.password");
        
        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                  protected PasswordAuthentication getPasswordAuthentication() {
                      return new PasswordAuthentication(username, password);
                  }
                });

        
        final Message mailMessage = new MimeMessage(session);
        mailMessage.setFrom(new InternetAddress(env.getProperty("support.email")));
        mailMessage.setRecipients(Message.RecipientType.TO,
            InternetAddress.parse(user.getEmail()));
        mailMessage.setSubject("Reset Password");
        mailMessage.setText(message + " \r\n" + url);
        return mailMessage;
    }

    private User createUserAccount(final UserDto accountDto) {
        User registered = null;
        try {
            registered = userService.registerNewUserAccount(accountDto);
        } catch (final EmailExistsException e) {
            return null;
        }
        return registered;
    }
}
