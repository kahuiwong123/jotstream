/*
  Warnings:

  - Added the required column `rank` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "rank" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "rank" TEXT NOT NULL;
