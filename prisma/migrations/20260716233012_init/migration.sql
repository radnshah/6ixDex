-- CreateTable
CREATE TABLE "Organization" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "industry" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "website" TEXT,
    "linkedin" TEXT,
    "founded" INTEGER,
    "employeeCount" INTEGER,
    "stage" TEXT,
    "headquarters" TEXT,
    "techStack" TEXT[],
    "aiStack" TEXT[],
    "founderIds" TEXT[],
    "placeId" TEXT,
    "eventIds" TEXT[],

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Person" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "linkedin" TEXT,
    "organizationIds" TEXT[],

    CONSTRAINT "Person_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Place" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "address" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Event" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtype" TEXT,
    "date" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "organizationIds" TEXT[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Content" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "links" JSONB NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "relatedOrganizationIds" TEXT[],
    "relatedEventIds" TEXT[],

    CONSTRAINT "Content_pkey" PRIMARY KEY ("entityId")
);

-- CreateTable
CREATE TABLE "Journal" (
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "relatedOrganizationIds" TEXT[],
    "relatedEventIds" TEXT[],

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("entityId")
);
