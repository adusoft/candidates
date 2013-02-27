package pl.softwaremind.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.softwaremind.model.Candidate;

public interface CandidatesRepository extends JpaRepository<Candidate, Long> {
  Candidate findByLastName(String lastName);
}
