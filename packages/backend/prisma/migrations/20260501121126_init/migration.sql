-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "play_url" TEXT NOT NULL,
    "package_name" TEXT NOT NULL,
    "interval_min" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenshots" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "taken_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apps_play_url_key" ON "apps"("play_url");

-- CreateIndex
CREATE UNIQUE INDEX "apps_package_name_key" ON "apps"("package_name");

-- CreateIndex
CREATE INDEX "screenshots_app_id_taken_at_idx" ON "screenshots"("app_id", "taken_at" DESC);

-- AddForeignKey
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
