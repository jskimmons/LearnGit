package com.talenteck.test;

import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

public class PasswordEncoder {
	 public static String shaencoder(String password,String username) {
	    	ShaPasswordEncoder encoder = new ShaPasswordEncoder(256);
	        String pwd = encoder.encodePassword(password,username);
	        return pwd;
	    }
	    
	    
	    public static void main(String[] args){
	    	System.out.println(shaencoder("sakthi-123","sakthee12@gmail.com"));
	    }

}
//91361e4be196b656eabfcf1289cb02e896a5a958efcdfa0c8aaea7734380acff