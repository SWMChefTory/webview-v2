import Header, { BackButton } from "@/src/shared/ui/header";
import { useRouter } from "next/router";
import MembershipWithdrawalPage from "./ui/withdrawal/membershipWithdrawal";
import { PrivacyPolicyPage, TermsAndConditionsPage } from "./ui";

export enum sectionTypes{
    MEMBERSHIP_WITHDRAWAL = "membership-withdrawal",
    PRIVACY_POLICY = "privacy-policy",
    TERMS_AND_CONDITIONS = "terms-and-conditions",
}

function SettingsSectionPage() {
  const router = useRouter();
  const { section } = router.query;
  const content = (()=>{
    switch(section){
      case sectionTypes.MEMBERSHIP_WITHDRAWAL:
        return <MembershipWithdrawalPage />;
      case sectionTypes.PRIVACY_POLICY:
        return <PrivacyPolicyPage />;
      case sectionTypes.TERMS_AND_CONDITIONS:
        return <TermsAndConditionsPage />;
    }
  })();

  return (
    <div className="flex flex-col h-screen relative overflow-y-hidden">
      <div className="flex">
      <Header
        color="bg-white"
        leftContent={<BackButton onClick={() => router.back()} />}
      />
      </div>
      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
      <div className="flex pb-safe " />
    </div>
  );
}

export default SettingsSectionPage;
