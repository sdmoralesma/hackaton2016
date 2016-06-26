package com.airhacks.boundary.rest;

import com.airhacks.boundary.Executor;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import java.util.Arrays;

@Path("/pipeline")
public class PipelineResource {

    public static final String GOLDBERG_PROJECT_FOLDER = "hackaton2016/goldberg";
    private static final String SELENIUM_CMD = "mvn package -o -f " + GOLDBERG_PROJECT_FOLDER + "/pom.xml verify -Dit.test=${testname}";

    private static final String FACEBOOK_ONE_IT = "FacebookOneIT";
    private static final String FACEBOOK_TWO_IT = "FacebookTwoIT";
    private static final String SPOTIFY_IT = "SpotifyIT";
    private static final String GOOGLE_NEWS_IT = "GoogleNewsIT";
    private static final String FBI_IT = "GoogleNewsIT";
    private static final String GOOGLE_MAPS_IT = "GoogleMapsIT";

    @Inject
    Executor executor;

    @GET
    @Path("ping")
    public Response ping() {
        return Response.ok("pong").build();
    }

    @GET
    @Path("pipe")
    public Response executeCommand(@QueryParam("id") Integer id) {
        switch (id) {
            case 1:
                executeSelenium(FACEBOOK_ONE_IT);
                JsonNotification json1 = new JsonNotification();
                json1.setMessage("Tomorrow is your wife's birthday, would you like to send her flowers?");
                json1.setIcon("calendar");
                json1.setType("question");
                json1.setNextStep("present");
                json1.setNextId("2");
                json1.setOptions(Arrays.asList("Yes, buy flowers", "No, thanks"));
                return Response.ok(json1).build();
            case 2:
                executeSelenium(FACEBOOK_TWO_IT);
                JsonNotification json2 = new JsonNotification();
                json2.setMessage("Your wife has recently liked a handbag on facebook, would you like to buy it?");
                json2.setImage("http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=30104969");
                json2.setType("question");
                json2.setNextStep("event");
                json2.setNextId("3");
                json2.setOptions(Arrays.asList("Yes, Buy and Ship this Bag", "No, thanks"));
                return Response.ok(json2).build();
            case 3:
                executeSelenium(SPOTIFY_IT);
                JsonNotification json3 = new JsonNotification();
                json3.setMessage("I found a Muse concert Saturday night in Amsterdam, do you want to get tickets?");
                json3.setImage("http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=30104969");
                json3.setType("question");
                json3.setOptions(Arrays.asList("Yes, Buy two tickets", "No, thanks"));
                json3.setNextStep("end");
                json3.setNextId("");
                return Response.ok(json3).build();
            case 4:
                executeSelenium(GOOGLE_MAPS_IT);
                JsonNotification json4 = new JsonNotification();
                json4.setMessage("You recently left home but your OV-chipkaart is empty, do you want to recharge?");
                json4.setImage("http://www.anitavangelder.nl/wp-content/uploads/OV-chipkaarten.png");
                json4.setType("question");
                json4.setNextId("2");
                json4.setOptions(Arrays.asList("Yes, Top 10 Euros", "No, thanks"));
                return Response.ok(json4).build();
            default:
                return Response.ok("Unknown id: " + id).build();
        }
    }

    private void executeSelenium(String testName) {
        String cmd = SELENIUM_CMD.replace("${testname}", testName);
        executor.execCommand(cmd);
    }

}
