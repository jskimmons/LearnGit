package com.talenteck.persistence.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.talenteck.persistence.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findById(Long id);

    @Override
    @Transactional(timeout = 10)
    public List<User> findAll();
    
    @Override
    void delete(User user);

}
