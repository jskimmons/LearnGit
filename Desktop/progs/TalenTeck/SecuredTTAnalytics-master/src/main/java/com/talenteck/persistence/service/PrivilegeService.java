package com.talenteck.persistence.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talenteck.persistence.dao.PrivilegeRepository;
import com.talenteck.persistence.dao.RoleRepository;
import com.talenteck.persistence.model.Privilege;
import com.talenteck.persistence.model.Role;

@SuppressWarnings("deprecation")
@Service
@Transactional
public class PrivilegeService implements IPrivilegeService{
	 @Autowired
	    private PrivilegeRepository repository;

	@Override
	public List<Privilege> getAllPrivileges() {
		return repository.findAll();
	}

	@Override
	public void deletePrivilege(Privilege privilege) {
		repository.delete(privilege);;
		
	}

	@Override
	public Privilege getPrivilegeByName(String name) {
		return repository.findByName(name);
	}

}
