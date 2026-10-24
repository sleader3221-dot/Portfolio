import { certifications, person, projects, record } from "../data/profile";
import { sha256 } from "./hash";

/** The case file is sealed with a SHA-256 of the facts it presents. Change a fact, the seal changes. */
export const caseHash: Promise<string> = sha256(JSON.stringify({ person, projects, record, certifications }));
