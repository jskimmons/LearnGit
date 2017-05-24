<?php header('Content-Type: text/xml; charset=utf-8'); 


	$input_rows = array(
		"total" => 8,
		1 => "Employment",
		2 => "Turnover",
		3 => "Vacancy",
		4 => "Training",
		5 => "OnboardingCost",
		6 => "TrainingCost",
		7 => "Compensation",
		8 => "Revenue"
	);


	if (!isset($_POST['Total_Locations'])) {
		$total_locations = 1;
	}
	else {
		$total_locations = $_POST['Total_Locations'];
	}

	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {

		$this_employment = "Location_{$i}_Employment";
		if (!isset($_POST[$this_employment])) {
			$employment[$i] = 0;
		}
		else {
			$employment[$i] = $_POST[$this_employment];
		}
		$this_current_turnover = "Location_{$i}_Turnover";
		if (!isset($_POST[$this_current_turnover])) {
			$current_turnover[$i] = 0.8;
		}
		else {
			$current_turnover[$i] = $_POST[$this_current_turnover];
		}
		$this_pre_hire_vacancy = "Location_{$i}_Vacancy";
		if (!isset($_POST[$this_pre_hire_vacancy])) {
			$pre_hire_vacancy[$i] = 1;
		}
		else {
			$pre_hire_vacancy[$i] = $_POST[$this_pre_hire_vacancy];
		}
		$this_weeks_training = "Location_{$i}_Training";
		if (!isset($_POST[$this_weeks_training])) {
			$weeks_training[$i] = 4;
		}
		else {
			$weeks_training[$i] = $_POST[$this_weeks_training];
		}
		$this_onboarding_cost = "Location_{$i}_OnboardingCost";
		if (!isset($_POST[$this_onboarding_cost])) {
			$onboarding_cost[$i] = 100;
		}
		else {
			$onboarding_cost[$i] = $_POST[$this_onboarding_cost];
		}
		$this_training_cost = "Location_{$i}_TrainingCost";
		if (!isset($_POST[$this_training_cost])) {
			$training_cost[$i] = 1000;
		}
		else {
			$training_cost[$i] = $_POST[$this_training_cost];
		}
		$this_compensation = "Location_{$i}_Compensation";
		if (!isset($_POST[$this_compensation])) {
			$compensation[$i] = 30000;
		}
		else {
			$compensation[$i] = $_POST[$this_compensation];
		}
		
		$this_total_revenue = "Location_{$i}_Revenue";
		if (!isset($_POST[$this_total_revenue])) {
			$total_revenue[$i] = 50000*$employment[$i];
		}
		else {
			$total_revenue[$i] = $_POST[$this_total_revenue];
		}

	}



	if (!isset($_POST['turnover_delta'])) {
		$turnover_delta = 0.05;
	}
	else {
		$turnover_delta = $_POST['turnover_delta'];
	}

	if (!isset($_POST['weibull_p'])) {
		$weibull_p = 0.7;
	}
	else {
		$weibull_p = $_POST['weibull_p'];
	}

	$revenue_delta = 0.9;

	$employment[0] = 0;

	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {

		$desired_turnover[$i] = $current_turnover[$i] - $turnover_delta;
		$total_compensation[$i] = $employment[$i]*$compensation[$i];

		$revenue_per_employee[$i] = $total_revenue[$i]/$employment[$i];
		$revenue_per_terminated_employee[$i] = $revenue_delta*$total_revenue[$i]/$employment[$i];


		$current_lambda[$i] = pow(-log(1-$current_turnover[$i]),1/$weibull_p);
		$current_seat_turnover[$i] = $current_lambda[$i]/gamma(1+1/$weibull_p);

		$desired_lambda[$i] = pow(-log(1-$desired_turnover[$i]),1/$weibull_p);
		$desired_seat_turnover[$i] = $desired_lambda[$i]/gamma(1+1/$weibull_p);

		$current_hires[$i] = $employment[$i]*$current_seat_turnover[$i];
		$desired_hires[$i] = $employment[$i]*$desired_seat_turnover[$i];

		$current_fraction_unproductive[$i] = $weeks_training[$i]*$current_hires[$i]/(52*$employment[$i] - $weeks_training[$i]*$current_hires[$i]);
		$desired_fraction_unproductive[$i] = $weeks_training[$i]*$desired_hires[$i]/(52*$employment[$i] - $weeks_training[$i]*$desired_hires[$i]);

		$reduction_of_hires[$i] = ($current_hires[$i] - $desired_hires[$i])/$current_hires[$i];

		$current_turnover_costs[$i] = $current_hires[$i]*($onboarding_cost[$i] + $training_cost[$i]);
		$current_vacancy_costs[$i] = $revenue_per_terminated_employee[$i]*$current_hires[$i]*($weeks_training[$i] +
$pre_hire_vacancy[$i])/52 - $compensation[$i]*$current_hires[$i]*$pre_hire_vacancy[$i]/52;


		$desired_turnover_costs[$i] = $desired_hires[$i]*($onboarding_cost[$i] + $training_cost[$i]);
		$desired_vacancy_costs[$i] = $revenue_per_terminated_employee[$i]*$desired_hires[$i]*($weeks_training[$i] +
$pre_hire_vacancy[$i])/52 - $compensation[$i]*$desired_hires[$i]*$pre_hire_vacancy[$i]/52;

		$savings[$i] = ($current_turnover_costs[$i] + $current_vacancy_costs[$i]) - ($desired_turnover_costs[$i] + $desired_vacancy_costs[$i]);

		$employment[0] += $employment[$i];

	}

	$current_turnover[0] = 0;
	$desired_turnover[0] = 0;
	$pre_hire_vacancy[0] = 0;
	$weeks_training[0] = 0;
	$onboarding_cost[0] = 0;
	$training_cost[0] = 0;
	$annual_compensation[0] = 0;
	$compensation[0] = 0;
	$total_revenue[0] = 0;
	$current_fraction_unproductive[0] = 0;
	$desired_fraction_unproductive[0] = 0;
	$revenue_per_employee[0] = 0;
	$revenue_per_terminated_employee[0] = 0;
	$current_seat_turnover[0] = 0;
	$desired_seat_turnover[0] = 0;
	$current_hires[0] = 0;
	$desired_hires[0] = 0;
	$reduction_of_hires[0] = 0;
	$current_turnover_costs[0] = 0;
	$desired_turnover_costs[0] = 0;
	$current_vacancy_costs[0] = 0;
	$desired_vacancy_costs[0] = 0;
	$savings[0] = 0;

	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {

		$employment_weight[$i] = $employment[$i]/$employment[0];

		$current_turnover[0] = $current_turnover[0] + $employment_weight[$i]*$current_turnover[$i];
		$desired_turnover[0] = $desired_turnover[0] + $employment_weight[$i]*$desired_turnover[$i];
		$pre_hire_vacancy[0] = $pre_hire_vacancy[0] + $employment_weight[$i]*$pre_hire_vacancy[$i];
		$weeks_training[0] = $weeks_training[0] + $employment_weight[$i]*$weeks_training[$i];
		$onboarding_cost[0] = $onboarding_cost[0] + $employment_weight[$i]*$onboarding_cost[$i];
		$training_cost[0] = $training_cost[0] + $employment_weight[$i]*$training_cost[$i];
		$compensation[0] = $compensation[0] + $employment_weight[$i]*$compensation[$i];
		$total_compensation[0] = $total_compensation[0] + $total_compensation[$i];
		$total_revenue[0] = $total_revenue[0] + $total_revenue[$i];
		$current_fraction_unproductive[0] = $current_fraction_unproductive[0] + $employment_weight[$i]*$current_fraction_unproductive[$i];
		$desired_fraction_unproductive[0] = $desired_fraction_unproductive[0] + $employment_weight[$i]*$desired_fraction_unproductive[$i];
		$revenue_per_employee[0] = $revenue_per_employee[0] + $employment_weight[$i]*$revenue_per_employee[$i];
		$revenue_per_terminated_employee[0] = $revenue_per_terminated_employee[0] + $employment_weight[$i]*$revenue_per_terminated_employee[$i];
		$current_seat_turnover[0] = $current_seat_turnover[0] + $employment_weight[$i]*$current_seat_turnover[$i];
		$desired_seat_turnover[0] = $desired_seat_turnover[0] + $employment_weight[$i]*$desired_seat_turnover[$i];
		$current_hires[0] = $current_hires[0] + $current_hires[$i];
		$desired_hires[0] = $desired_hires[0] + $desired_hires[$i];
		$reduction_of_hires[0] = $reduction_of_hires[0] + $employment_weight[$i]*$reduction_of_hires[$i];
		$current_turnover_costs[0] = $current_turnover_costs[0] + $current_turnover_costs[$i];
		$desired_turnover_costs[0] = $desired_turnover_costs[0] + $desired_turnover_costs[$i];
		$current_vacancy_costs[0] = $current_vacancy_costs[0] + $current_vacancy_costs[$i];
		$desired_vacancy_costs[0] = $desired_vacancy_costs[0] + $desired_vacancy_costs[$i];
		$savings[0] = $savings[0] + $savings[$i];



	

	}

	$savings_graph[0]["savings"] = 0;
	for ( $reduction = 1 ; $reduction <= 100 ; $reduction++ ) {


		for ( $i = 1 ; $i <= $total_locations ; $i++ ) {

			$this_turnover[$i] = $current_turnover[$i]*(100-$reduction)/100;


			$this_lambda[$i] = pow(-log(1-$this_turnover[$i]),1/$weibull_p);
			$this_seat_turnover[$i] = $this_lambda[$i]/gamma(1+1/$weibull_p);

			$this_hires[$i] = $employment[$i]*$this_seat_turnover[$i];

			$this_fraction_unproductive[$i] = $weeks_training[$i]*$this_hires[$i]/(52*$employment[$i] - $weeks_training[$i]*$this_hires[$i]);

			$this_reduction_of_hires[$i] = ($current_hires[$i] - $this_hires[$i])/$current_hires[$i];

			$this_turnover_costs[$i] = $this_hires[$i]*($onboarding_cost[$i] + $training_cost[$i]);
			$this_vacancy_costs[$i] = $revenue_per_terminated_employee[$i]*$this_hires[$i]*($weeks_training[$i] +
$pre_hire_vacancy[$i])/52 - $compensation[$i]*$this_hires[$i]*$pre_hire_vacancy[$i]/52;

			$this_savings[$i] = ($current_turnover_costs[$i] + $current_vacancy_costs[$i]) - ($this_turnover_costs[$i] + $this_vacancy_costs[$i]);


		}


		$this_turnover[0] = 0;
		$this_fraction_unproductive[0] = 0;
		$this_seat_turnover[0] = 0;
		$this_hires[0] = 0;
		$this_reduction_of_hires[0] = 0;
		$this_turnover_costs[0] = 0;
		$this_vacancy_costs[0] = 0;
		$this_savings[0] = 0;




		for ( $i = 1 ; $i <= $total_locations ; $i++ ) {

			$this_turnover[0] = $this_turnover[0] + $employment_weight[$i]*$this_turnover[$i];
			$this_fraction_unproductive[0] = $this_fraction_unproductive[0] + $employment_weight[$i]*$this_fraction_unproductive[$i];
			$this_seat_turnover[0] = $this_seat_turnover[0] + $employment_weight[$i]*$this_seat_turnover[$i];
			$this_hires[0] = $this_hires[0] + $this_hires[$i];
			$this_reduction_of_hires[0] = $this_reduction_of_hires[0] + $employment_weight[$i]*$this_reduction_of_hires[$i];
			$this_turnover_costs[0] = $this_turnover_costs[0] + $this_turnover_costs[$i];
			$this_vacancy_costs[0] = $this_vacancy_costs[0] + $this_vacancy_costs[$i];
			$this_savings[0] = $this_savings[0] + $this_savings[$i];


		}

		$savings_graph[$reduction]["savings"] = $this_savings[0];

	}


	$output_xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<node>\n<tabledata>\n";

	$output_xml = "{$output_xml}<Employment>\n  <Overall>{$employment[0]}</Overall>\n</Employment>\n";
	$output_xml = "{$output_xml}<Turnover>\n  <Overall>{$current_turnover[0]}</Overall>\n</Turnover>\n";
	$output_xml = "{$output_xml}<Vacancy>\n  <Overall>{$pre_hire_vacancy[0]}</Overall>\n</Vacancy>\n";
	$output_xml = "{$output_xml}<Training>\n  <Overall>{$weeks_training[0]}</Overall>\n</Training>\n";
	$output_xml = "{$output_xml}<OnboardingCost>\n  <Overall>{$onboarding_cost[0]}</Overall>\n</OnboardingCost>\n";
	$output_xml = "{$output_xml}<TrainingCost>\n  <Overall>{$training_cost[0]}</Overall>\n</TrainingCost>\n";
	$output_xml = "{$output_xml}<Compensation>\n  <Overall>{$compensation[0]}</Overall>\n</Compensation>\n";
	$output_xml = "{$output_xml}<Revenue>\n  <Overall>{$total_revenue[0]}</Overall>\n</Revenue>\n";

	$output_xml = "{$output_xml}<DesiredQuits>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_turnover[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_turnover[0]}</Overall>\n</DesiredQuits>\n";

	$output_xml = "{$output_xml}<CurrentSeatTurnover>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$current_seat_turnover[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$current_seat_turnover[0]}</Overall>\n</CurrentSeatTurnover>\n";

	$output_xml = "{$output_xml}<DesiredSeatTurnover>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_seat_turnover[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_seat_turnover[0]}</Overall>\n</DesiredSeatTurnover>\n";

	$output_xml = "{$output_xml}<CurrentHires>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$current_hires[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$current_hires[0]}</Overall>\n</CurrentHires>\n";

	$output_xml = "{$output_xml}<DesiredHires>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_hires[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_hires[0]}</Overall>\n</DesiredHires>\n";

	$output_xml = "{$output_xml}<CurrentUnproductive>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$current_fraction_unproductive[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$current_fraction_unproductive[0]}</Overall>\n</CurrentUnproductive>\n";

	$output_xml = "{$output_xml}<DesiredUnproductive>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_fraction_unproductive[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_fraction_unproductive[0]}</Overall>\n</DesiredUnproductive>\n";

	$output_xml = "{$output_xml}<Reduction>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$reduction_of_hires[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$reduction_of_hires[0]}</Overall>\n</Reduction>\n";

	$output_xml = "{$output_xml}<CurrentTCosts>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$current_turnover_costs[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$current_turnover_costs[0]}</Overall>\n</CurrentTCosts>\n";

	$output_xml = "{$output_xml}<DesiredTCosts>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_turnover_costs[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_turnover_costs[0]}</Overall>\n</DesiredTCosts>\n";

	$output_xml = "{$output_xml}<CurrentVCosts>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$current_vacancy_costs[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$current_vacancy_costs[0]}</Overall>\n</CurrentVCosts>\n";

	$output_xml = "{$output_xml}<DesiredVCosts>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$desired_vacancy_costs[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$desired_vacancy_costs[0]}</Overall>\n</DesiredVCosts>\n";

	$output_xml = "{$output_xml}<Savings>\n";
	for ( $i = 1 ; $i <= $total_locations ; $i++ ) {
		$output_xml = "{$output_xml}  <Location_{$i}>{$savings[$i]}</Location_{$i}>\n";
	}
	$output_xml = "{$output_xml}  <Overall>{$savings[0]}</Overall>\n</Savings>\n";

	$output_xml = "{$output_xml}</tabledata>\n  <graphdata>\n";


	for ( $reduction = 0 ; $reduction <= 100 ; $reduction++ ) {

		$output_xml = "{$output_xml}    <datapoint>\n      <reduction>{$reduction}</reduction>\n      <savings>{$savings_graph[$reduction]["savings"]}</savings>\n    </datapoint>\n";

	}

	$output_xml = "{$output_xml}  </graphdata>\n</node>\n";

	echo "{$output_xml}";


function gamma($x) {
    if ($x <= 0.0)
    {
        die("Invalid input argument $x. Argument must be positive");
    }

    # Split the function domain into three intervals:
    # (0, 0.001), [0.001, 12), and (12, infinity)

    ###########################################################################
    # First interval: (0, 0.001)
    #
    # For small x, 1/Gamma(x) has power series x + gamma x^2  - ...
    # So in this range, 1/Gamma(x) = x + gamma x^2 with error on the order of x^3.
    # The relative error over this interval is less than 6e-7.

    $gamma = 0.577215664901532860606512090; # Euler's gamma constant

    if ($x < 0.001) {
        return 1.0/($x*(1.0 + $gamma*$x));
    }

    ###########################################################################
    # Second interval: [0.001, 12)

    if ($x < 12.0)
    {
        # The algorithm directly approximates gamma over (1,2) and uses
        # reduction identities to reduce other arguments to this interval.
        
        $y = $x;
        $n = 0;
        $arg_was_less_than_one = ($y < 1.0);

        # Add or subtract integers as necessary to bring y into (1,2)
        # Will correct for this below
        if ($arg_was_less_than_one)
        {
            $y += 1.0;
        }
        else
        {
            $n = floor($y) - 1;  # will use n later
            $y -= $n;
        }

        # numerator coefficients for approximation over the interval (1,2)
        $p =
        array(
            -1.71618513886549492533811E+0,
             2.47656508055759199108314E+1,
            -3.79804256470945635097577E+2,
             6.29331155312818442661052E+2,
             8.66966202790413211295064E+2,
            -3.14512729688483675254357E+4,
            -3.61444134186911729807069E+4,
             6.64561438202405440627855E+4
        );

        # denominator coefficients for approximation over the interval (1,2)
        $q =
        array(
            -3.08402300119738975254353E+1,
             3.15350626979604161529144E+2,
            -1.01515636749021914166146E+3,
            -3.10777167157231109440444E+3,
             2.25381184209801510330112E+4,
             4.75584627752788110767815E+3,
            -1.34659959864969306392456E+5,
            -1.15132259675553483497211E+5
        );

        $num = 0.0;
        $den = 1.0;

        $z = $y - 1;
        for ($i = 0; $i < 8; $i++)
        {
            $num = ($num + $p[$i])*$z;
            $den = $den*$z + $q[$i];
        }
        $result = $num/$den + 1.0;

        # Apply correction if argument was not initially in (1,2)
        if ($arg_was_less_than_one)
        {
            # Use identity gamma(z) = gamma(z+1)/z
            # The variable "result" now holds gamma of the original y + 1
            # Thus we use y-1 to get back the orginal y.
            $result /= ($y-1.0);
        }
        else
        {
            # Use the identity gamma(z+n) = z*(z+1)* ... *(z+n-1)*gamma(z)
            for ($i = 0; $i < $n; $i++) {
                $result *= $y++;
            }
        }

        return $result;
    }

    ###########################################################################
    # Third interval: [12, infinity)

    if ($x > 171.624)
    {
        # Correct answer too large to display. 
        return Double.POSITIVE_INFINITY;
    }

    return exp(log_gamma($x));
}




?>

