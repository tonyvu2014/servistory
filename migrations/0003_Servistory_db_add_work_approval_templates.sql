INSERT INTO `Servistory`.`WorkApprovalTemplate` (id, title, description, reason, date_time_created)
VALUES 
(
    uuid(),
    "Air Filter Replacement",
    "Remove the old air filter, clean the air box, and replace it with (____).",
    "The air filter is dirty and needs to be replaced in order to prevent dust, dirt and other contaminants from getting into the engine and causing damage.",
    NOW()
), 
(
    uuid(),
    "Alternator Replacement",
    "Remove the old alternator and replace it with (____). This process includes disconnecting the battery, removing and replacing the alternator, and finally reconnecting the battery and testing the output to ensure everything is running smoothly.",
    "An alternator voltage regulator test showed us that the alternator is worse for wear. The alternator charges the battery and provides electrical power for all of your vehicle's systems. When the alternator fails, your vehicle will no longer be able to start and may switch off at any time.",
    NOW()
),
(
    uuid(),
    "Battery Replacement",
    "Remove old car battery and replace with (_____).",
    "",
    NOW()
),
(
    uuid(),
    "Brake Pads Replacement (Front)",
    "Remove old front brake pads and replace them with new brake pads. During the replacement, we will inspect the disc rotors and brake fluid, as these may need to be replaced at the same time.",
    "As per the attached photo the front brake pads are excessively worn and due for replacement. Operating a vehicle with worn out or faulty brake pads can endanger you and other motorists on the road, and not allow you to stop in time in an emergency.",
    NOW()
),
(
    uuid(),
    "Brake Pads Replacement (Back)",
    "Remove old front brake pads and replace them with new (_____) brake pads. During the replacement, we will also inspect the disc rotors and brake fluid.",
    "As per the attached photo the front brake pads are excessively worn and due for replacement.",
    NOW() 
),
(
    uuid(),
    "Brake Pads Replacement (Back)",
    "Remove old back brake pads and replace them with new (_____) brake pads. During the replacement, we will also inspect the disc rotors and brake fluid.",
    "As per the attached photo the back brake pads are excessively worn and due for replacement.",
    NOW()
),
(
    uuid(),
    "Brake Pads Replacement (All)",
    "Remove all brake pads and replace them with new (_____) brake pads. During the replacement, we will also inspect the disc rotors and brake fluid.",
    "The brake pads are excessively worn and due for replacement.",
    NOW()
),
(
    uuid(),
    "Radiator bottom hose replacement",
    "Replace old radiator top hose and fit a new (_____) one with new clamps. This process includes draining and then refilling the radiator coolant, and then running the engine to ensure it is fixed.",
    "Your bottom radiator hose is worse for wear and needs to be replaced. Continuing to drive with a damaged radiator hose runs the risk of overheating the engine that could cause irreparable damage and result in the engine needing to be replaced.",
    NOW()
),
(
    uuid(),
    "Radiator top hose replacement",
    "Replace old radiator top hose and fit a new (_____) one with new clamps. This process includes draining and then refilling the radiator coolant, and then running the engine to confirm it is fixed.",
    "Top radiator hose is worse for wear and needs to be replaced. Driving your car with a radiator top hose that is worse for wear could lead to a coolant leak and/or your engine overheating.",
    NOW()
),
(
    uuid(),
    "Radiator replacement",
    "Remove the old radiator and replace it with (_____). Once the new radiator is installed, filled with new coolant and system bled to remove air, we will road test the vehicle to ensure everything is running smoothly.",
    "",
    NOW()
),
(
    uuid(),
    "Spark Plug Replacement",
    "Remove old spark plugs and replace them with (_____). The steps include: cleaning the surface around the ignition system, disconnecting the ignition leads or coil packs and inspecting the threads in the cylinder head for damage.",
    "Spark plugs have worn out. If they are not replaced, the engine will misfire and increase fuel consumption.",
    NOW()
),
(
    uuid(),
    "Thermostat Replacement",
    "Remove the failed thermostat and replace it with (_____). This process includes draining the cooling system, unbolting it from the engine, replacing it, refilling the cooling system and running the engine to operating temperature to confirm the repair.",
    "The thermostat is worse for wear so it is not keeping the engine at the best operating temperature. A failed thermostat can overheat and damage the engine.",
    NOW()
),
(
    uuid(),
    "Tires Replacement",
    "Remove old tires and replace them with (_____). During this process we replace the air valve inside of the rim, fit the new tires, inflate, perform a wheel alignment and test drive the vehicle.",
    "The tread depth on your tires is currently between __mm and __mm which is getting low. The minimum legal tread depth is 1.5mm. Tyres are best replaced in complete sets, this way you don’t get uneven wear between tyres and your car functions more smoothly.",
    NOW()
),
(
    uuid(),
    "Tires Replacement (with photo)",
    "Remove old tires and replace with (_____). During this process we replace the air valve inside of the rim, fit the new tyres, inflate, perform a wheel alignment and test drive the vehicle.",
    "As per the attached photos the tread depth on your tires is currently between __mm and __mm which is getting low. The minimum legal tread depth is 1.5mm. Tyres are best replaced in complete sets, this way you don’t get uneven wear between tyres and your car functions more smoothly."
    NOW()
),
(
    uuid(),
    "Wiper Blades Replacement",
    "Remove current windscreen wiper blade and replace with (_____) wiper blade refill __mm x ___mm.",
    "Wiper blade is damaged and overtime may scratch the windscreen causing permanent damage requiring a new windscreen.",
    NOW()
),
(
    uuid(),
    "Wheel Alignment",
    "A wheel alignment is where we bring the car’s suspension to its proper configuration. The process includes using an alignment machine to give precise measurements and then making the correct adjustments.",
    "A wheel alignment is needed to prevent further issues, including uneven tyre wear as well as wear and tear to the suspension.",
    NOW()
)