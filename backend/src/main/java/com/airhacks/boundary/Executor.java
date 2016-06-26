package com.airhacks.boundary;

import javax.inject.Inject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class Executor {

    private static final int EXIT_CODE_OK = 0;

    private enum STD {
        OUT, ERR
    }

    @Inject
    Logger tracer;

    public String execCommand(String command) {
        return this.execCommand(command, STD.ERR);
    }

    public String execCommand(String command, STD returnOnError) {
        try {
            Process proc = Runtime.getRuntime().exec(command);
            int status = proc.waitFor();
            if (status == EXIT_CODE_OK) {
                return getStreamAsString(proc.getInputStream());
            }

            String stdErrorMsg = getStreamAsString(proc.getErrorStream());
            String stdOutMsg = getStreamAsString(proc.getInputStream());
            if (returnOnError == STD.ERR) {
                tracer.info(() -> "STD OUT MSG: \n" + stdOutMsg);
                throw new IllegalStateException(stdErrorMsg);
            } else if (returnOnError == STD.OUT) {
                tracer.info(() -> "STD ERROR MSG: \n" + stdErrorMsg);
                throw new IllegalStateException(stdOutMsg);
            } else {
                throw new IllegalStateException("unknown STD: " + returnOnError);
            }
        } catch (InterruptedException | IOException e) {
            tracer.log(Level.SEVERE, e, e::getMessage);
            throw new IllegalStateException(e);
        }
    }

    private String getStreamAsString(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            return "";
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

}
