package pl.softwaremind.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.softwaremind.model.Candidate;
import pl.softwaremind.repository.CandidatesRepository;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping(value = "/candidates", produces = "application/json")
public class CandidateController {

  @Autowired
  private CandidatesRepository candidatesRepository;

  @RequestMapping(method = RequestMethod.GET)
  @ResponseBody
  public List<Candidate> list() {
    List<Candidate> all = candidatesRepository.findAll();
//    if (all.isEmpty()) {
    if (false) {
      List<Candidate> list = new ArrayList<Candidate>();
      for (int i = 1; i <= 5; i++) {
        Candidate candidate = new Candidate();
        candidate.setFirstName("First Name #" + i);
        candidate.setLastName("Last Name #" + i);
        candidate.setStartDate(new Date());
        candidate.setEmail("test@softwaremind.pl");
        list.add(candidate);
      }
      return candidatesRepository.save(list);
    }
    return all;
  }

  @RequestMapping(value = "{id}", method = GET)
  @ResponseBody
  public Candidate getCandidate(@PathVariable Long id) {
    Candidate candidate = candidatesRepository.findOne(id);
    return candidate;
  }

  @RequestMapping(method = POST, consumes = "application/json")
  @ResponseStatus(CREATED)
  @ResponseBody
  public Candidate create(@Valid @RequestBody Candidate candidate) {
    return candidatesRepository.save(candidate);
  }

  @RequestMapping(value = "{id}", method = PUT, consumes = "application/json")
  @ResponseStatus(OK)
  @ResponseBody
  public Candidate update(@Valid @RequestBody Candidate candidate, @PathVariable Long id) {
    return candidatesRepository.save(candidate);
  }

  @RequestMapping(value = "{id}", method = DELETE)
  @ResponseStatus(OK)
  public void destroy(@PathVariable Long id) {
    candidatesRepository.delete(id);
  }

}
