package com.talenteck.persistence.service;

import java.util.Collection;
import java.util.Date;

import javax.validation.constraints.NotNull;

import com.talenteck.persistence.model.Role;
import com.talenteck.validation.PasswordMatches;
import com.talenteck.validation.ValidEmail;

@PasswordMatches
public class UserDto {

    private long id;

    @ValidEmail
    @NotNull
    private String email;
    
    @NotNull
    private String password;
        
    @NotNull
    private String firstName;
    
    private String middleName;
    
    @NotNull
    private String lastName;

    @NotNull
    private String workLocation;
    
    @NotNull
    private String workCompany;

    @NotNull
    private String workTitle;
    
    private String internationalCode;
    
    @NotNull
    private String phoneNumber;
    
    @NotNull
    private String phoneType;
    
    @NotNull
    private String matchingPassword;  
    
    
    private String passwordExpirydate;    
    private String createdDate;
    private String updatedDate;

    
    private boolean enabled;
    private String databasee;
    private boolean tokenExpired;
    
    private Collection<Role> roles;
    

    public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getDatabasee() {
		return databasee;
	}

	public void setDatabasee(String databasee) {
		this.databasee = databasee;
	}

	public boolean isTokenExpired() {
		return tokenExpired;
	}

	public void setTokenExpired(boolean tokenExpired) {
		this.tokenExpired = tokenExpired;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getPasswordExpirydate() {
		return passwordExpirydate;
	}

	public void setPasswordExpirydate(String passwordExpirydate) {
		this.passwordExpirydate = passwordExpirydate;
	}

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}

	public String getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(String updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Collection<Role> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Role> roles) {
		this.roles = roles;
	}

	public String getEmail() {
        return email;
    }

    public void setEmail(final String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }
    
    public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

    public String getLastName() {
        return lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    public String getMatchingPassword() {
        return matchingPassword;
    }

    public void setMatchingPassword(final String matchingPassword) {
        this.matchingPassword = matchingPassword;
    }


    public String getWorkLocation() {
		return workLocation;
	}

	public void setWorkLocation(String workLocation) {
		this.workLocation = workLocation;
	}

	public String getWorkCompany() {
		return workCompany;
	}

	public void setWorkCompany(String workCompany) {
		this.workCompany = workCompany;
	}

	public String getWorkTitle() {
		return workTitle;
	}

	public void setWorkTitle(String workTitle) {
		this.workTitle = workTitle;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPhoneType() {
		return phoneType;
	}

	public void setPhoneType(String phoneType) {
		this.phoneType = phoneType;
	}

  
    @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("User [firstName=").append(roles).append("]").append("[lastName=").append(lastName).append("]").append("[email").append(email).append("]").append("[password").append(password).append("]");
        return builder.toString();
    }


    public String getInternationalCode() {
        return internationalCode;
    }

    public void setInternationalCode(String internationalCode) {
        this.internationalCode = internationalCode;
    }
}
