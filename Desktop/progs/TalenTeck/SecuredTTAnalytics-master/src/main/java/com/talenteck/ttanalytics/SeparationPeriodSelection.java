package com.talenteck.ttanalytics;

import javax.xml.bind.annotation.XmlElement;

public class SeparationPeriodSelection {

		String filterValue;
		double t30;
		double t60;
		double t90;
		double t180;
		double t365;

		@XmlElement(name = "FilterValue")
		public void setFilterValue(String filterValue) {
			this.filterValue = filterValue;
		}
		
		String getFilterValue(){
			return this.filterValue;
		}

		
		@XmlElement(name = "t30")
		public void setT30(double t30) {
			this.t30 = t30;
		}
		
		double getT30(){
			return this.t30;
		}

		@XmlElement(name = "t60")
		public void setT60(double t60) {
			this.t60 = t60;
		}
		
		double getT60(){
			return this.t60;
		}

		@XmlElement(name = "t90")
		public void setT90(double t90) {
			this.t90 = t90;
		}
		
		double getT90(){
			return this.t90;
		}

		@XmlElement(name = "t180")
		public void setT180(double t180) {
			this.t180 = t180;
		}
		
		double getT180(){
			return this.t180;
		}

		@XmlElement(name = "t365")
		public void setT365(double t365) {
			this.t365 = t365;
		}
		
		double getT365(){
			return this.t365;
		}

	
}
