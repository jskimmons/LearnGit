package com.talenteck.ttanalytics;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class GetFilterList
 */
@WebServlet("/GetFilterList")
public class GetFilterList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetFilterList() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		PrintWriter responseWriter = response.getWriter();

		FilterList returnList = new FilterList();

		//This needs to be gotten from session once that part is coded
		String database = "iqorfilterdb";
		

		try {
			returnList.populate(database);
		} catch(Exception populateListException) {
			returnList.insertErrorAndWrite("Error populating filter list:" + populateListException.getMessage(),responseWriter);
			return;

		}
		
		(returnList.filters.get(1)).writeSuccess(responseWriter);

	}

}
