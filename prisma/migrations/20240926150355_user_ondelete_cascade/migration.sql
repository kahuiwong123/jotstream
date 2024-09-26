-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_userId_fkey";

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
