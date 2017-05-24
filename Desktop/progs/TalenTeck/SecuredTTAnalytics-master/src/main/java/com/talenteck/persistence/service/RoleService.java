package com.talenteck.persistence.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.talenteck.persistence.dao.RoleRepository;
import com.talenteck.persistence.model.Role;
import com.talenteck.persistence.model.User;

@SuppressWarnings("deprecation")
@Service
@Transactional
public class RoleService implements IRoleService{
	 @Autowired
	    private RoleRepository repository;

	@Override
	public List<Role> getAllRoles() {
		return repository.findAll();
	}

	@Override
	public void deleteRole(Role role) {
		repository.delete(role);;
	}

	@Override
	public Role getRoleByName(String name) {
		return repository.findByName(name);
	}

	@Override
	public void updateRole(Role updatedRole) {
		final Role role = new Role();
		role.setId(updatedRole.getId());
		role.setName(updatedRole.getName());
		role.setPrivileges(updatedRole.getPrivileges());
		System.out.println("update role"+role.toString());
//		update role Role [name=NEW_USER][id=3][privileges=[Privilege [name=READ_PRIVILEGE][id=1], Privilege [name=NO_PRIVILEGE][id=3]]]

		repository.save(role);
	}

	@Override
	public String deleteRole(String name) {
    	Role role = repository.findByName(name);
 	   System.out.println("deleting role" + role.toString());
 	   if(role.getUsers().isEmpty()){
        repository.delete(role);
        return "roleDeleted";
 	   }
 	   else{
 		   return "usersPresent";
 	   }
	}
}
