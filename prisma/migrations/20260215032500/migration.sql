ALTER TABLE "Subscription"
DROP COLUMN "enterDate",
DROP COLUMN "leaveDate",
ADD  COLUMN "accessLeaveDate" TIMESTAMP(3),
ADD  COLUMN "periodEnterDate" TIMESTAMP(3) NOT NULL,
ADD  COLUMN "periodLeaveDate" TIMESTAMP(3);
