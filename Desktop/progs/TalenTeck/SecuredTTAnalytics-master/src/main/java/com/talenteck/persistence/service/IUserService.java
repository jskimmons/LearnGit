package com.talenteck.persistence.service;

import java.util.List;

import com.talenteck.persistence.model.PasswordResetToken;
import com.talenteck.persistence.model.User;
import com.talenteck.persistence.model.VerificationToken;
import com.talenteck.validation.EmailExistsException;

public interface IUserService {

    User registerNewUserAccount(UserDto accountDto) throws EmailExistsException;

    void updateUserAccount(UserDto user);

    void saveRegisteredUser(User user);
    
    void createVerificationTokenForUser(User user, String token);

    VerificationToken getVerificationToken(String VerificationToken);
    
    VerificationToken  getVerificationTokenByUser(User user);
    
    VerificationToken generateNewVerificationToken(String token);

    User getUser(String verificationToken);

    void createPasswordResetTokenForUser(User user, String token);

    User findUserByEmail(String email);

    PasswordResetToken getPasswordResetToken(String token);

    User getUserByPasswordResetToken(String token);

    User getUserByID(long id);

    void changeUserPassword(User user, String password);

    boolean checkIfValidOldPassword(User user, String password);
    
    List<User> getAllUsers();

	void deleteUser(long id);


}
