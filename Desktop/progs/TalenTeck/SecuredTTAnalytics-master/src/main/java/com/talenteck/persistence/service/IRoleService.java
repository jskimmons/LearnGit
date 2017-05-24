package com.talenteck.persistence.service;

import java.util.List;

import com.talenteck.persistence.model.Role;

public interface IRoleService {
    List<Role> getAllRoles() ;
    
    void deleteRole(Role role);

	Role getRoleByName(String name);

	void updateRole(Role role);

	String deleteRole(String name);


}
