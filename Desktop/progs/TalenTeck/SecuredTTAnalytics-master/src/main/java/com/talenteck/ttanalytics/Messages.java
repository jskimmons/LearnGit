package com.talenteck.ttanalytics;

// This is for JAXB to create an XML element to hold error messages generated while
// attempting to extract a sheet.  It was originally written for the Headcount sheet but I expect
// it can be used for other sheets as well.

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;

@XmlRootElement(name="Messages")
public class Messages {

	ArrayList<String> messages;
	@XmlElement(name="Message")
	public void setMessages(ArrayList<String> messages){
		this.messages = messages;
	}
	
	public ArrayList<String> getMessages() {
		return this.messages;
	}

	public void addMessage(String message) {
		if ( this.messages == null ){
			this.messages = new ArrayList<String>();
		}
		this.messages.add(message);
	}

	
}
