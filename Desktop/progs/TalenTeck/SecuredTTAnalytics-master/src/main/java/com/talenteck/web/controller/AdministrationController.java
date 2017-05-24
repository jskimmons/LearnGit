package com.talenteck.web.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.talenteck.persistence.dao.PrivilegeRepository;
import com.talenteck.persistence.dao.RoleRepository;
import com.talenteck.persistence.model.Privilege;
import com.talenteck.persistence.model.Role;
import com.talenteck.persistence.model.User;
import com.talenteck.persistence.service.IPrivilegeService;
import com.talenteck.persistence.service.IRoleService;
import com.talenteck.persistence.service.IUserService;
import com.talenteck.persistence.service.UserDto;
import com.talenteck.web.util.GenericResponse;

@Controller
public class AdministrationController {
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private IUserService userService;

    @Autowired
    private IRoleService roleService;
    
    @Autowired
    private IPrivilegeService privilegeService;
    
    
    @Autowired
    private MessageSource messages;
/*
    @Autowired
    private JavaMailSender mailSender;
*/
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private Environment env;

    public AdministrationController() {
        super();
    }

    
    @RequestMapping(value = "/admin/viewusers", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView listAllUsers(final HttpServletRequest request) {
        LOGGER.debug("Listing all user accounts");

        final List<User> registeredUsers = userService.getAllUsers();
		ModelAndView modelAndView = new ModelAndView("/admin/viewusers");
		modelAndView.addObject("userList", registeredUsers);

        return modelAndView;
    }
    
    
    @RequestMapping(value = "/admin/viewroles", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView listAllRoles(final HttpServletRequest request) {
        LOGGER.debug("Listing all roles");

        final List<Role> allRoles = roleService.getAllRoles();
        HashMap<String,String> roles= new HashMap<String, String>();
        
        for(Role r:allRoles){
        	
        	String privileges="";
        	for(Privilege p:(List<Privilege>) r.getPrivileges()){
        	 privileges =privileges+ p.getName() + ",";
        	}
        	roles.put(r.getName(),privileges);
        }        
		ModelAndView modelAndView = new ModelAndView("/admin/viewroles");
		modelAndView.addObject("roleList", roles);

        return modelAndView;
    }
    
    
    @RequestMapping(value = "/admin/viewprivileges", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView listAllPrivs(final HttpServletRequest request) {
        LOGGER.debug("Listing all privileges");

        final List<Privilege> privileges = privilegeService.getAllPrivileges();
		ModelAndView modelAndView = new ModelAndView("/admin/viewprivileges");
		modelAndView.addObject("privilegeList", privileges);

        return modelAndView;
    }
    
    
    
   @RequestMapping(value = "/admin/users/update/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView editUser(@PathVariable("id") final Long id, final HttpServletRequest request) {
        LOGGER.debug("Editng account.." + id);	        
        
        List<Role> roles = roleService.getAllRoles();       
        final User registeredUser = userService.getUserByID(id);
        List<String> dbList =Arrays.asList("iqorfilterdb","iqorfilterdbtest","iqormarketdb","brandixworksheetdb","teletechworksheetdb","filterdblocal");
        List<String> userDB = Arrays.asList(registeredUser.getDatabasee().split(","));
        ModelAndView modelAndView = new ModelAndView("/admin/updateuser");
        Map<String,Object> map =new HashMap<String,Object>();
        map.put("user", registeredUser);
        map.put("roleList", roles);
        map.put("dbList", dbList);
        map.put("userDB", userDB);

        
        modelAndView.addObject("map",map);

        return modelAndView;
    }
    
  
	@RequestMapping(value = "/admin/users/update", method = RequestMethod.POST)
    @ResponseBody
   public GenericResponse saveUser(final UserDto accountDto , final HttpServletRequest request) {
		
		Map<String, String[]> param = request.getParameterMap();
		String[] roles = param.get("roless");

	     ArrayList<Role> userRoles=new ArrayList<Role>();
		 if(roles!=null){
			 for(String r:roles){
				 userRoles.add(roleService.getRoleByName(r));       
		        }
			 accountDto.setRoles(userRoles); 
		 }		
        LOGGER.debug("Saving account.." + accountDto.toString());
        userService.updateUserAccount(accountDto); 
        return new GenericResponse(messages.getMessage("message.success", null, request.getLocale()));
    }  
	
    
    
   @RequestMapping(value = "/admin/users/delete/{id}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse deleteUser(@PathVariable("id") final Long id, final HttpServletRequest request) {
	   userService.deleteUser(id);
       return new GenericResponse(messages.getMessage("message.deleted", null, request.getLocale()));
    }
        
    @RequestMapping(value = "/admin/users", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView listAllUserss(final HttpServletRequest request) {
        LOGGER.debug("Listing all user accounts");

        final List<User> registeredUsers = userService.getAllUsers();
		ModelAndView modelAndView = new ModelAndView("users");
		modelAndView.addObject("userList", registeredUsers);

        return modelAndView;
    }	
	
    
    @RequestMapping(value = "/admin/roles/update/{name}", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView editRole(@PathVariable("name") final String name, final HttpServletRequest request) {
        LOGGER.debug("Editng role.." + name);	        
        
        List<Privilege> privileges = privilegeService.getAllPrivileges();       
        final Role selectedRole = roleService.getRoleByName(name);
        List<User> users = (List<User>) selectedRole.getUsers();
        
        System.out.println("users roles" + users);
        
        ModelAndView modelAndView = new ModelAndView("/admin/updaterole");
        Map<String,Object> map =new HashMap<String,Object>();
        map.put("role", selectedRole);
        map.put("privilegeList", privileges);
        map.put("userList", users);

        
        modelAndView.addObject("map",map);

        return modelAndView;
    }
    
  
	@RequestMapping(value = "/admin/roles/update", method = RequestMethod.POST)
    @ResponseBody
   public GenericResponse saveRole(final Role role , final HttpServletRequest request) {
		
		Map<String, String[]> param = request.getParameterMap();
		String[] privileges = param.get("privilegess");

	     ArrayList<Privilege> rolePrivileges=new ArrayList<Privilege>();
		 if(privileges!=null){
			 for(String p:privileges){
				 rolePrivileges.add(privilegeService.getPrivilegeByName(p));       
		        }
			 role.setPrivileges(rolePrivileges); 
		 }		
		 
		 
        LOGGER.debug("Saving role.." + role.toString());
        roleService.updateRole(role); 
        return new GenericResponse(messages.getMessage("message.success", null, request.getLocale()));
    }  
	
    
	@RequestMapping(value = "/admin/roles/delete/{name}", method = RequestMethod.GET)
	@ResponseBody
	    public ModelAndView deleteeRole(@PathVariable("name") final String name, final HttpServletRequest request) {
		   Role role = roleService.getRoleByName(name);
		   List<User> users = (List<User>) role.getUsers();

	       ModelAndView modelAndView = new ModelAndView("/admin/deleterole");
	        Map<String,Object> map =new HashMap<String,Object>();
	        map.put("roleName", role.getName());
	        map.put("userList", role.getUsers());
	       modelAndView.addObject("map",map);
	       return modelAndView;
		  
	    }
	   
   @RequestMapping(value = "/admin/roles/delete/{name}", method = RequestMethod.POST)
    @ResponseBody
    public GenericResponse deleteRole(@PathVariable("name") final String name, final HttpServletRequest request) {
	   System.out.println("delete name" + name);
	   String status = roleService.deleteRole(name);
	   if(status.equalsIgnoreCase("userDeleted"))
       return new GenericResponse(messages.getMessage("message.deleted", null, request.getLocale()));
	   else
		return new GenericResponse(messages.getMessage("Deleting this role also removes users from this group Yes/No", null, request.getLocale()));		   	

    }
        
   @RequestMapping(value = "/admin/privileges/update/{id}", method = RequestMethod.GET)
   @ResponseBody
   public ModelAndView editPrivilege(@PathVariable("id") final Long id, final HttpServletRequest request) {
       LOGGER.debug("Editng privilege.." + id);	        
       
       List<Role> roles = roleService.getAllRoles();       
       final User registeredUser = userService.getUserByID(id);
       List<String> dbList =Arrays.asList("iqorfilterdb","iqorfilterdbtest","iqormarketdb","brandixworksheetdb","teletechworksheetdb","filterdblocal");
       List<String> userDB = Arrays.asList(registeredUser.getDatabasee().split(","));
       ModelAndView modelAndView = new ModelAndView("/admin/updateuser");
       Map<String,Object> map =new HashMap<String,Object>();
       map.put("user", registeredUser);
       map.put("roleList", roles);
       map.put("dbList", dbList);
       map.put("userDB", userDB);

       
       modelAndView.addObject("map",map);

       return modelAndView;
   }
   
 
	@RequestMapping(value = "/admin/privileges/update", method = RequestMethod.POST)
   @ResponseBody
  public GenericResponse savePrivilege(final UserDto accountDto , final HttpServletRequest request) {
		
		Map<String, String[]> param = request.getParameterMap();
		String[] roles = param.get("roless");

	     ArrayList<Role> userRoles=new ArrayList<Role>();
		 if(roles!=null){
			 for(String r:roles){
				 //userRoles.add(roleRepository.findByName(r));       
		        }
			 accountDto.setRoles(userRoles); 
		 }		
       LOGGER.debug("Saving account.." + accountDto.toString());
       userService.updateUserAccount(accountDto); 
       return new GenericResponse(messages.getMessage("message.success", null, request.getLocale()));
   }  
	
   
   
  @RequestMapping(value = "/admin/privileges/delete/{id}", method = RequestMethod.GET)
   @ResponseBody
   public GenericResponse deletePrivilege(@PathVariable("id") final Long id, final HttpServletRequest request) {
	   userService.deleteUser(id);
      return new GenericResponse(messages.getMessage("message.deleted", null, request.getLocale()));
   }

	
    
    
    
    
    
    
    
    
	  
    /*
     * registeredUser.getRoles() : [Role [name=ROLE_USER][id=2]]
     * 
     * @RequestMapping(value = "/admin/users/update/{id}", method = RequestMethod.GET)
    public String editUser(@PathVariable("id") final Long id, Model model ) {
    	LOGGER.debug("showUpdateUserForm() : {}", id);
		User user = userService.getUserByID(id);
		model.addAttribute("userForm", user);
    	System.out.println("showUpdateUserForm() : {}"+ model.toString());

		populateDefaultModel(model);
		
		return "/admin/updateuser";
    }
    
    

    private void populateDefaultModel(Model model) {
    	System.out.println("populateDefaultModel() : {}"+ model.toString());

    	Map<Integer, String> roles = new LinkedHashMap<Integer, String>();
    	roles.put(1, "ROLE_ADMIN");
    	roles.put(2, "ROLE_USER");
    	roles.put(3, "NEW_USER");
    	roles.put(4, "TEST_USER");
    	roles.put(5, "iQOR_USER");
    	roles.put(6, "B_USER");
    	roles.put(7, "ALL_CLIENT_USER");
		model.addAttribute("userRoles", roles);
	}*/

	/*Map<String, String[]> param = request.getParameterMap();
	
	for(Map.Entry<String, String[]> p:param.entrySet())
	{
		System.out.println(p.getKey() + "/" + Arrays.deepToString(p.getValue()));
	}
	
	 String[] roles = param.get("roless");
     ArrayList<Role> userRoles=new ArrayList<Role>();
	 if(roles!=null){
		 for(String r:roles){
			 userRoles.add(roleRepository.findByName(r));       
	        }
		 accountDto.setRoles(userRoles); 
	 }		 */
}
