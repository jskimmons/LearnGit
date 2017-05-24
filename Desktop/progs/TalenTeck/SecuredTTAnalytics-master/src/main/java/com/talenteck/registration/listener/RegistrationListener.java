package com.talenteck.registration.listener;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.talenteck.persistence.model.User;
import com.talenteck.persistence.service.IUserService;
import com.talenteck.registration.OnRegistrationCompleteEvent;

@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {
    @Autowired
    private IUserService service;

    @Autowired
    private MessageSource messages;

    @Autowired
    private Environment env;

    @Override
    public void onApplicationEvent(final OnRegistrationCompleteEvent event) {
        this.confirmRegistration(event);
    }

    private void confirmRegistration(final OnRegistrationCompleteEvent event) {
        final User user = event.getUser();
        final String token = UUID.randomUUID().toString();
        service.createVerificationTokenForUser(user, token);

        try {
            final Message email = constructEmailMessage(event, user, token);
            Transport.send(email);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    
    private final Message constructEmailMessage(final OnRegistrationCompleteEvent event, final User user, final String token) throws AddressException, MessagingException {
        final String recipientAddress = user.getEmail();
        final String subject = "Registration Confirmation";
        final String confirmationUrl = event.getAppUrl() + "/regitrationConfirm.html?token=" + token;
        final String message = messages.getMessage("message.regSucc", null, event.getLocale());
        
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
            InternetAddress.parse(recipientAddress));
        mailMessage.setSubject(subject);
        mailMessage.setText(message + " \r\n" + confirmationUrl);
        return mailMessage;
    }

}
