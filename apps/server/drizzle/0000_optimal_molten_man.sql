CREATE TABLE `interventions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_id` integer NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`odometer_km` integer,
	`price_cents` integer,
	`workshop` text,
	`next_check_date` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "interventions_type_check" CHECK("interventions"."type" IN ('tagliando', 'cambio_gomme', 'revisione', 'freni', 'carrozzeria', 'altro')),
	CONSTRAINT "interventions_price_cents_check" CHECK("interventions"."price_cents" IS NULL OR "interventions"."price_cents" >= 0),
	CONSTRAINT "interventions_odometer_km_check" CHECK("interventions"."odometer_km" IS NULL OR "interventions"."odometer_km" >= 0)
);
--> statement-breakpoint
CREATE INDEX `interventions_vehicle_id_date_idx` ON `interventions` (`vehicle_id`,`date`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`plate` text,
	`make_model` text,
	`created_at` text NOT NULL
);
