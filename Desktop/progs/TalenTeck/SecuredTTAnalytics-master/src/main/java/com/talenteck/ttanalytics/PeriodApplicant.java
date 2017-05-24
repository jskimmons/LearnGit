package com.talenteck.ttanalytics;

import java.io.PrintWriter;

//import javax.xml.bind.JAXBContext;
//import javax.xml.bind.JAXBException;
//import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.google.gson.Gson;

@XmlRootElement(name="Period")
public class PeriodApplicant {

	String periodName;
	String periodLabel;

	@XmlElement(name = "PeriodName")
	String getPeriodName(){
		return this.periodName;
	}

	public void setPeriodName(String name) {
		this.periodName = name;
	}

	@XmlElement(name = "PeriodLabel")
	String getPeriodLabel(){
		return this.periodLabel;
	}

	public void setPeriodLabel(String label) {
		this.periodLabel = label;
	}
		

	//Here for debugging, may be removed
	public void writeSuccess(PrintWriter writer){
		try {
			Gson gson = new Gson();
			//JAXBContext jaxbContext = JAXBContext.newInstance( PeriodApplicant.class );
			//Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			//jaxbMarshaller.setProperty( Marshaller.JAXB_FORMATTED_OUTPUT, true );
			//jaxbMarshaller.setProperty(MarshallerProperties.MEDIA_TYPE, "application/json");
			//jaxbMarshaller.marshal(this , writer);
			writer.println(gson.toJson(this));
		} catch (Exception e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}

	
}
