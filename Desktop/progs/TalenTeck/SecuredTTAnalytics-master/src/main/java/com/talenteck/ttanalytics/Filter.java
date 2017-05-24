package com.talenteck.ttanalytics;

import java.io.PrintWriter;
import java.util.ArrayList;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="Filter")
public class Filter {
	
	String filterName;
	ArrayList<String> filterValues;

	
	@XmlElement(name = "FilterName")
	public void setFilterName(String name) {
		this.filterName = name;
	}
	
	String getFilterName(){
		return this.filterName;
	}

	@XmlElement(name = "FilterValue")
	public void setFilterValues(ArrayList<String> values) {
		this.filterValues = values;
	}

	public ArrayList<String> getFilterValues() {
		return this.filterValues;
	}


	void addValue(String value) {
		if (this.filterValues == null) {
			this.filterValues = new ArrayList<String>();
		}
		this.filterValues.add(value);
	}

	// This is just here for debugging and should be removed if you don't remember what it's for.
	public void writeSuccess(PrintWriter writer){
		try {

			JAXBContext jaxbContext = JAXBContext.newInstance( Filter.class );
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty( Marshaller.JAXB_FORMATTED_OUTPUT, true );
			//jaxbContext.jaxbContext.jaxbMarshaller.setProperty(MarshallerProperties.MEDIA_TYPE, "application/json");
			jaxbMarshaller.setProperty("eclipselink.media-type", "application/json");
	        //jaxbMarshaller.setProperty("eclipselink.json.include-root", false);
			jaxbMarshaller.marshal(this , writer);
		} catch (JAXBException e) {
			writer.println("JAXB exception:" + e.getMessage());
		}
		return;

	}

	
	
}
