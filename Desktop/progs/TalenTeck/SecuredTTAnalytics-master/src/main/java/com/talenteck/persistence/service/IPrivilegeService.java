package com.talenteck.persistence.service;

import java.util.List;

import com.talenteck.persistence.model.Privilege;

public interface IPrivilegeService {
    List<Privilege> getAllPrivileges() ;
    
    void deletePrivilege(Privilege privilege);
    
    Privilege getPrivilegeByName(String name);


}
