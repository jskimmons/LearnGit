package com.talenteck.persistence.model;

import java.util.Collection;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    private String email;
    @Column(length = 100)
    private String password;
    
    
    private String firstName;
    private String middleName;
    private String lastName;
    
    private String workLocation;
    private String workCompany;
    private String workTitle;
    
    private String internationalCode;
    private String phoneNumber;
    private String phoneType;
    
    private Date passwordExpirydate;    
    private Date createdDate;
    private Date updatedDate;
   
    private boolean enabled;
    private String databasee;
    private boolean tokenExpired;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id") , inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id") )
    private Collection<Role> roles;

    public User() {
        super();
        this.enabled = false;
        this.tokenExpired = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Date getPasswordExpirydate() {
        return passwordExpirydate;
    }

    public void setPasswordExpirydate(Date passwordExpirydate) {
        this.passwordExpirydate = passwordExpirydate;
    }

   
    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(final String username) {
        this.email = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
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
	public String getInternationalCode() {
	     return internationalCode;
	    }

	public void setInternationalCode(String internationalCode) {
	    this.internationalCode = internationalCode;
	  }
	
    public Collection<Role> getRoles() {
        return roles ;
    }

    public void setRoles(final Collection<Role> roles) {
        this.roles = roles;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(final boolean enabled) {
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

    public void setTokenExpired(final boolean expired) {
        this.tokenExpired = expired;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final User user = (User) obj;
        if (!email.equals(user.email)) {
            return false;
        }
        return true;
    }

   @Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("User [id=").append(id).append("]").append("[firstName=").append(firstName).append("]").append("[lastName=").append(lastName).append("]").append("[username=").append(email).append("]")
        .append("[middlename=").append(middleName).append("]").append("[password=").append(password).append("]").append("[passwordExpirydate=").append(passwordExpirydate).append("]")
        .append("[workLocation=").append(workLocation).append("]").append("[workCompany=").append(workCompany).append("]")
        .append("[workTitle=").append(workTitle).append("]").append("[phoneNumber=").append(phoneNumber).append("]").append("[phoneType=").append(phoneType)
        .append("]").append("[Roles=").append(roles).append("]")
        .append("]").append("[internationalCode=").append(internationalCode).append("]")
        .append("[createdDate=").append(createdDate).append("]").append("[updatedDate=").append(updatedDate).append("]");
        return builder.toString();
    }
}