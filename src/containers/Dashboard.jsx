import DashboardHeader from "../components/DashboardHeader";
import ChallengeContainer from "./ChallengeContainer";

export default function Dashboard() {

  return (
    <div id={"dashboard"}>
      <DashboardHeader/>
      <ChallengeContainer/>
    </div>
  )
}