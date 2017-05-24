package com.talenteck.persistence.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talenteck.persistence.model.PasswordResetToken;
import com.talenteck.persistence.model.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByToken(String token);

    PasswordResetToken findByUser(User user);

}
