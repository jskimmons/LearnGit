package com.talenteck.persistence.service;

import java.util.Date;

import javax.validation.constraints.NotNull;

public class UpdateDto {
	
		private int id;
		
		private Date createdDate;
		
		private String password;
		
		private boolean tokenExpired;

	    @NotNull
	    private String email;
	        
	    @NotNull
	    private String firstName;
	    
	    private String middleName;
	    
	    @NotNull
	    private String lastName;
	    
	    private boolean enabled;
	    
	    @NotNull
	    private String databasee;

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
	    
	    private Date passwordExpiryDate;

	    private Date updatedDate;

	  
	    public String getEmail() {
			return email;
		}


		public void setEmail(String email) {
			this.email = email;
		}


		public String getFirstName() {
			return firstName;
		}


		public void setFirstName(String firstName) {
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


		public void setLastName(String lastName) {
			this.lastName = lastName;
		}


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


		public String getInternationalCode() {
			return internationalCode;
		}


		public void setInternationalCode(String internationalCode) {
			this.internationalCode = internationalCode;
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


		public Date getPasswordExpiryDate() {
			return passwordExpiryDate;
		}


		public void setPasswordExpiryDate(Date passwordExpiryDate) {
			this.passwordExpiryDate = passwordExpiryDate;
		}


		public Date getUpdatedDate() {
			return updatedDate;
		}


		public void setUpdatedDate(Date updatedDate) {
			this.updatedDate = updatedDate;
		}


		@Override
	    public String toString() {
	        final StringBuilder builder = new StringBuilder();
	        builder.append("User [firstName=").append(firstName).append("]").append("[lastName=").append(lastName);
	        return builder.toString();
	    }

	}

