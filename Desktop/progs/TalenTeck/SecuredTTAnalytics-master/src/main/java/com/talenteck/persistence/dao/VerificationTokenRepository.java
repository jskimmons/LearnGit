package com.talenteck.persistence.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talenteck.persistence.model.User;
import com.talenteck.persistence.model.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    VerificationToken findByToken(String token);

    VerificationToken findByUser(User user);

}
