import React from "react";
import Alert from "../ui/alert/Alert";

export default function WithdrawAlert({
  kycStatus,
  withdrawalPasswordSet,
}: {
  kycStatus: string;
  withdrawalPasswordSet: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* KYC Rejected */}
      {kycStatus === "rejected" && (
        <Alert
          variant="error"
          title="KYC Rejected"
          message="Your KYC verification was rejected. Please re-submit your documents to enable withdrawals."
        />
      )}

      {/* KYC Still Being Reviewed */}
      {kycStatus === "reviewing" && (
        <Alert
          variant="warning"
          title="KYC Under Review"
          message="Your KYC is still being reviewed. Withdrawals will be available once verification is complete."
        />
      )}

      {/* No Withdrawal Password Set */}
      {!withdrawalPasswordSet && (
        <Alert
          variant="warning"
          title="Withdrawal Password Required"
          message="You haven’t set a withdrawal password yet. Please update your profile to proceed with withdrawals."
        />
      )}
    </div>
  );
}
