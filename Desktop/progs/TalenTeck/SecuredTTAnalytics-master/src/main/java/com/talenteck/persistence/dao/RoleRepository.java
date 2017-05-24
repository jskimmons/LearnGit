package com.talenteck.persistence.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talenteck.persistence.model.Role;
import com.talenteck.persistence.model.User;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);
    
    @Override
    void delete(Role role);
    
    public List<Role> findAll();


}
