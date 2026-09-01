package Google_Workspace;

import static io.restassured.RestAssured.given;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.testng.annotations.Test;

import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;

public class DeleteMembersFromGroups_All {
	
	String apiKey;
	String token;
	
	DeleteMembersFromGroups_All() throws IOException{
		FileReader fis = new FileReader("GoogleWorkspace.properties");
		Properties ps = new Properties();
		ps.load(fis);
		
		this.apiKey = "AIzaSyBeo4NGA__U6Xxy-aBE6yFm19pgq8TY-TM";
		this.token = "";
				
//		this.token = ps.getProperty("token");
	}
	
  @Test
  public void f() throws IOException {
	  
	  // https://developers.google.com/admin-sdk/directory/reference/rest/v1/members/delete
	  // open above url execute something, take a request from network tab copy curl and take the bearer token
	  
	  
	  Response response1,response2,response3,response4;
	  RestAssured.baseURI = "https://content-admin.googleapis.com/admin/directory"; 
	  
//	  String groupEmailId0 = "testingexpopeningssubscribed@jobcurator.in";
//	  String groupEmailId1 = "testingexpopeningssubscribed1@jobcurator.in";
//	  String groupEmailId2 = "testingexpopeningssubscribed2@jobcurator.in";
	  String groupEmailId3 = "testingexpopeningssubscribed3@jobcurator.in";
//	  String groupEmailId = "testing-experienced-openings@@googlegroups.com";
	  
	  
	  File file = new File("DeleteMembersFromGroup.txt");
	  FileReader fr=new FileReader(file);
	  BufferedReader br=new BufferedReader(fr);
	  int totalids=0,failedids=0;
	  List<String> failedidsList = new ArrayList<String>();
	  
	  String email;
	  while((email=br.readLine())!=null) {
		  totalids++;

		  
//		  response1 = deleteEmailIdFromGroup(groupEmailId0,email);		  
//		  response2 = deleteEmailIdFromGroup(groupEmailId1,email);
//		  response3 = deleteEmailIdFromGroup(groupEmailId2,email);
		  response4 = deleteEmailIdFromGroup(groupEmailId3,email);
		  
//		  int status = response1.statusCode();
		  if(
//				  response1.statusCode()!=204 && 
//				  response2.statusCode()!=204 && 
//				  response3.statusCode()!=204 && 
				  response4.statusCode()!=204
				  ) {
			  failedids++;
			  failedidsList.add(email);
			  System.out.println("Failed for id: "+email+" Status: "+response4.statusCode());
//			  break;
//			  System.out.println("Failed for id: "+email+" Status: "+response.statusCode());
		  }
		  
		  else {
			  System.out.println("Deleted id: "+totalids + "  =  "+email);
		  }
		  
		  
//		  break;
	  }
	  
	  
	  System.out.println("Total ids: "+totalids);
	  System.out.println("Failed ids: "+failedids);
	  System.out.println("Failed ids List: "+failedidsList);
	  
	  
	  
	  
//		JsonPath path = new JsonPath(response);
//		System.out.println("======> Total artifacts: "+path.getList("artifacts").size());
//		List<Integer> artifactIds =path.getList("artifacts.id"); 
		
//		System.out.println(artifactIds);
	  
  }
  
  public Response deleteEmailIdFromGroup (String groupEmailId, String emailId) {
	  
	  Response response = 	
				 given() //.log().all()
				.queryParam("key", this.apiKey)
//				.headers("content-type", "application/json")
				.headers("authorization",token)
//				.headers("x-requested-with","XMLHttpRequest")
				.headers("x-origin","https://explorer.apis.google.com")
//				.headers("x-referer","https://explorer.apis.google.com")
				.when().delete("v1/groups/"+groupEmailId+"/members/"+emailId)
				.then()//.log().all()
				.extract().response();
	  
	  return response;
	  
  }
}
