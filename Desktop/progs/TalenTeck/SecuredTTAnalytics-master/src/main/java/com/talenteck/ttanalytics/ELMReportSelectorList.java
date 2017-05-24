package com.talenteck.ttanalytics;
	import java.io.PrintWriter;
	import java.sql.Connection;
	import java.sql.DriverManager;
	import java.sql.PreparedStatement;
	import java.sql.ResultSet;
	import java.sql.SQLException;
	import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;

	import com.google.gson.Gson;

	public class ELMReportSelectorList {
		HashMap<String,List<String>> locationToZip = new HashMap<String,List<String>>();
		ArrayList<Selector> selectorList;
		Messages messages;

		@XmlElement(name = "SelectorValue")
		public void setSelectorList(ArrayList<Selector> selectorList) {
			this.selectorList = selectorList;
		}

		public ArrayList<Selector> getSelectorList() {
			return this.selectorList;
		}

		@XmlElement(name = "Messages")
		public void setMessages(Messages messages) {
			this.messages = messages;
		}

		public Messages getMessages() {
			return messages;
		}

		void addSelector(Selector selector) {
			if (this.selectorList == null) {
				this.selectorList = new ArrayList<Selector>();
			}
			this.selectorList.add(selector);
		}


		public void populate(String database) throws Exception {
			Selector thisFilterSelector = null;
			SelectorValue thisSelectorValue = null;

			Connection con = null;
			PreparedStatement st = null;
			ResultSet rs = null;

			String url = DatabaseParameters.url + database;
			String user = DatabaseParameters.username;
			String password = DatabaseParameters.password;
			try {
				Class.forName("com.mysql.jdbc.Driver").newInstance();
			} catch (Exception openException) {
				Exception driverInitException = new Exception("Failed to open SQL driver instance:" + openException.getMessage());
				throw driverInitException;
			}

			try {

				con = DriverManager.getConnection(url, user, password);

			} catch (Exception connectException) {
				Exception driverInitException = new Exception("Failed to connect to database:" + connectException.getMessage());
				throw driverInitException;
			}

			for (int i = 1; i <= 2; i++) {
				String query = "SELECT filtername" + i + ", filtervalue" + i + ",defaultfiltervalue1 FROM elmreport GROUP BY filtervalue" + i ;
						if(i==2){
						//query+= " ORDER BY MAX(applicant) DESC";
						query+= " ORDER BY applicant DESC";

						}

				try {
					st = con.prepareStatement(query);	
					rs = st.executeQuery();
					boolean selectorCreated = false;
					while (rs.next()) {
						if (rs.getString("filtername" + i) != null && rs.getString("filtervalue" + i) != null) {
							if (!selectorCreated) {
								thisFilterSelector = new Selector();
								thisFilterSelector.setSelectorName(rs.getString("filtername" + i));
								thisFilterSelector.setSelectorLabel(rs.getString("filtername" + i));
								thisFilterSelector.setDefaultValue(rs.getString("defaultfiltervalue1"));
								selectorCreated = true;
							}
							thisSelectorValue = new SelectorValue();
							thisSelectorValue.setValueLabel(rs.getString("filtervalue" + i));
							thisSelectorValue.setValueName(rs.getString("filtervalue" + i));
							thisFilterSelector.addSelectorValue(thisSelectorValue);
						}
					}

					if (selectorCreated) {
						this.addSelector(thisFilterSelector);

					}
					
					if (rs != null) {
						rs.close();
					}
					if (st != null) {
						st.close();
					}
				} catch (Exception queryException) {
					Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage());
					try {
						if (rs != null) {
							rs.close();
						}
						if (st != null) {
							st.close();
						}
						if (con != null) {
							con.close();
						}

					} catch (SQLException closeSQLException) {
						Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
						throw rethrownCloseException;
					}
					throw rethrownQueryException;
				}
			}
			
			 //String query ="SELECT filtervalue1,GROUP_CONCAT(DISTINCT filtervalue2) AS zips FROM elmreport GROUP BY filtervalue1 ORDER BY filtervalue2";
			String query = "SELECT filtervalue1,filtervalue2,max(applicant) FROM elmreport GROUP BY filtervalue1,filtervalue2 ORDER BY filtervalue1 asc,max(applicant) desc";
			 try {
					st = con.prepareStatement(query);
					rs = st.executeQuery();
					String location =null;
					ArrayList<String> zips = new ArrayList<String>();
					String preLocation = null;
					int i=0;
					while(rs.next()){
						location = rs.getString("filtervalue1");
						if(!location.equalsIgnoreCase(preLocation)){
							if(preLocation!=null) locationToZip.put(preLocation,zips);
							zips = new ArrayList<String>();
							zips.add(rs.getString("filtervalue2"));
						}else{
							zips.add(rs.getString("filtervalue2"));
						}
						//System.out.println(rs.getString("filtervalue2"));
						preLocation = location;
					}
					locationToZip.put(preLocation,zips);

					
					/*while (rs.next()) {
						String location = rs.getString("filtervalue1");
						locationToZip.put(rs.getString("filtervalue1"), Arrays.asList(rs.getString("zips").split(","))); //("\\s*,\\s*")
					}*/
					if (rs != null) {
						rs.close();
					}
					if (st != null) {
						st.close();
					}
					}catch (Exception queryException) {
						Exception rethrownQueryException = new Exception("Error during SQL query:" + queryException.getMessage());
						try {
							if (rs != null) {
								rs.close();
							}
							if (st != null) {
								st.close();
							}
							if (con != null) {
								con.close();
							}

						} catch (SQLException closeSQLException) {
							Exception rethrownCloseException = new Exception("SQL query failed:" + closeSQLException.getMessage());
							throw rethrownCloseException;
						}
						throw rethrownQueryException;
					}
			
		}
			
		public void insertErrorAndWrite(String errorMessage, PrintWriter writer) {
			Messages messageList = new Messages();
			messageList.addMessage(errorMessage);
			this.setMessages(messageList);
			try {
				Gson gson = new Gson();
				writer.println(gson.toJson(this));
			} catch (Exception e) {
				writer.println("JAXB exception:" + e.getMessage());
			}
			return;

		}

		public void writeSuccess(PrintWriter writer) {
			try {
				Gson gson = new Gson();
				writer.println(gson.toJson(this));
			} catch (Exception e) {
				writer.println("JAXB exception:" + e.getMessage());
			}
			return;

		}
	}
