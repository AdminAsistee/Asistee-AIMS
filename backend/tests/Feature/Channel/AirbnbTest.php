<?php

namespace Tests\Feature\Channel;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Channels\ChannelAbstract;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class mockGuzzleHttp {
	private $return;
	private $status_code;
	public function __construct($return,$status_code=200){$this->return = $return;$this->status_code=$status_code;}
	public function request(){ return $this;}
	public function getBody(){ return $this;}
	public function getContents(){ return $this->return;}
	public function getStatusCode(){ return $this->status_code;}
}

class AirbnbTest extends TestCase
{
	public function setUp() {
        parent::setUp();
        $this->airbnb = ChannelAbstract::getChannelObject(1);
        $this->default_date1='2017-12-01';
        $this->default_date2='2018-01-01';
        $this->default_listing_channel_id='453840593';
        $this->default_authenticaiton_parameters = '8gdfre7tw904u';
        // Use this to test private functions. Make them public at first to test, then skip tests and the method is made private for production
        // $this->markTestSkipped('Testing that a markTestSkipped function call in the constructor will skip an entire file.');
        // Use this for unimplemented tests.
        // $this->markTestIncomplete('This test has not been implemented yet.');
    }

    // getDateDefinitions function tests

    /** @test */
    public function airbnb_can_make_a_secured_call()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-06",
					"nights"=>8,
					"number_of_guests"=>2,
					"thread_id"=>404547628,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>56916,
					"payout_price_in_host_currency"=>56916,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertTrue($responseBody);
    }

    /** @test */
    public function airbnb_get_date_definitions_with_empty_string_return_should_fail()
    {
		$client = new mockGuzzleHttp(""
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function airbnb_get_date_definitions_with_empty_json_return_should_fail()
    {
		$client = new mockGuzzleHttp(json_encode(
				[]
			)
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function airbnb_get_date_definitions_with_non_json_string_return_should_fail()
    {
		$client = new mockGuzzleHttp("This is not a json decodable string!"
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function airbnb_get_date_definitions_with_incorrect_status_response_string_return_should_fail()
    {
		$client = new mockGuzzleHttp(json_encode(['error'=>['key'=>'value']]),400
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function airbnb_get_date_definitions_with_invalid_api_key_response_should_fail()
    {
		$client = new mockGuzzleHttp(json_encode(['error'=>['key'=>'value']]),401
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    // processBookingsFromDays tests


    /** @test */
    public function airbnb_normal_processing_with_single_booking_returns_expected_booking()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-08",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-06",
					"nights"=>8,
					"number_of_guests"=>2,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>56916,
					"payout_price_in_host_currency"=>56916,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMC9Z9RN25',
				'guest_name'=>'Bob',
				'price'=>56916,
				'checkin'=>'2017-12-06',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>2,
				'number_of_beds'=>1,
				'message_thread_id'=>404797563
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_multiple_reservations_returns_expected_bookings()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-02",
					"nights"=>1,
					"number_of_guests"=>1,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"NRH4G8MQ5Y",
					"start_date"=>"2017-12-04",
					"nights"=>10,
					"number_of_guests"=>5,
					"thread_id"=>4043389356,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>8745937,
					"payout_price_in_host_currency"=>8745937,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"木村",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMC9Z9RN25',
				'guest_name'=>'Bob',
				'price'=>47536,
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-03',
				'number_of_guests'=>1,
				'number_of_beds'=>1,
				'message_thread_id'=>404797563
			],
			[
    			'confirmation_code'=>'NRH4G8MQ5Y',
				'guest_name'=>'木村',
				'price'=>8745937,
				'checkin'=>'2017-12-04',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>5,
				'number_of_beds'=>3,
				'message_thread_id'=>4043389356
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_single_reservation_multiple_days_before_returns_expected_booking()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"BRQ75Z48MJ",
					"start_date"=>"2017-11-01",
					"nights"=>35,
					"number_of_guests"=>6,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Jim",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"BRQ75Z48MJ",
					"start_date"=>"2017-11-01",
					"nights"=>35,
					"number_of_guests"=>6,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Jim",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"BRQ75Z48MJ",
					"start_date"=>"2017-11-01",
					"nights"=>35,
					"number_of_guests"=>6,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Jim",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'BRQ75Z48MJ',
				'guest_name'=>'Jim',
				'price'=>47536,
				'checkin'=>'2017-11-01',
				'checkout'=>'2017-12-06',
				'number_of_guests'=>6,
				'number_of_beds'=>3,
				'message_thread_id'=>404797563
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_external_calendar_should_correctly_receive_bookings()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Coolta Kyoka (165390431) CHECKIN: 2017-12-02 16:00:00 +0900 \nCHECKOUT: 2017-12-11 11:00:00 +0900 \nNIGHTS: 9 \nGUESTS: 5 \nPHONE:  \nEMAIL: cooltakyoka@yahoo.com \nPROPERTY: Top City Tokyo Tower View Shibuya Near!, Top City Tokyo Tower View Shibuya Near!"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Coolta Kyoka (165390431) CHECKIN: 2017-12-02 16:00:00 +0900 \nCHECKOUT: 2017-12-11 11:00:00 +0900 \nNIGHTS: 9 \nGUESTS: 5 \nPHONE:  \nEMAIL: cooltakyoka@yahoo.com \nPROPERTY: Top City Tokyo Tower View Shibuya Near!, Top City Tokyo Tower View Shibuya Near!"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Coolta Kyoka (165390431) CHECKIN: 2017-12-02 16:00:00 +0900 \nCHECKOUT: 2017-12-11 11:00:00 +0900 \nNIGHTS: 9 \nGUESTS: 5 \nPHONE:  \nEMAIL: cooltakyoka@yahoo.com \nPROPERTY: Top City Tokyo Tower View Shibuya Near!, Top City Tokyo Tower View Shibuya Near!"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,
			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals([
    		[
    			'confirmation_code'=>'165390431',
				'guest_name'=>'Coolta Kyoka',
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-11',
				'number_of_guests'=>5,
				'number_of_beds'=>3,
				'price'=>null,
				'message_thread_id'=>null,
			],
    	],$processed_bookings);
    }

    // TODO : airbnb_normal_processing_with_external_calendar_not_available_should_make_super_default_booking
    // Will have to be done via construction because don't know how long ...........
    // FOR NOW :: Should skip.
    /** @test */
    public function airbnb_normal_processing_with_external_calendar_not_available_should_skip_for_the_moment()
    {
    	if(date("Y-m-d") >= "2018-01-01"){
    		$this->markTestIncomplete('This test\'s time limit is expired. This test must be re-written to implmenet constructed external calendar bookings. Currently skips constructed bookings.');
    	}
    	
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Not avaliable"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Coolta Kyoka (165390431) CHECKIN: 2017-12-03 16:00:00 +0900 \nCHECKOUT: 2017-12-11 11:00:00 +0900 \nNIGHTS: 8 \nGUESTS: 3 \nPHONE:  \nEMAIL: cooltakyoka@yahoo.com \nPROPERTY: Top City Tokyo Tower View Shibuya Near!, Top City Tokyo Tower View Shibuya Near!"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "Airhost",
					"notes"=> "Coolta Kyoka (165390431) CHECKIN: 2017-12-03 16:00:00 +0900 \nCHECKOUT: 2017-12-11 11:00:00 +0900 \nNIGHTS: 9 \nGUESTS: 5 \nPHONE:  \nEMAIL: cooltakyoka@yahoo.com \nPROPERTY: Top City Tokyo Tower View Shibuya Near!, Top City Tokyo Tower View Shibuya Near!"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,
			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'165390431',
				'guest_name'=>'Coolta Kyoka',
				'checkin'=>'2017-12-03',
				'checkout'=>'2017-12-11',
				'number_of_guests'=>3,
				'number_of_beds'=>2,
				'price'=>null,
				'message_thread_id'=>null,
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_blocked_calendar_should_correctly_receive_bookings_with_option_on()
    {
    	$this->markTestIncomplete('This test has not been implemented yet. Blocked data needed. Construction logic needed.');
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-02",
					"nights"=>1,
					"number_of_guests"=>1,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"NRH4G8MQ5Y",
					"start_date"=>"2017-12-04",
					"nights"=>10,
					"number_of_guests"=>5,
					"thread_id"=>4043389356,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>8745937,
					"payout_price_in_host_currency"=>8745937,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"木村",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMC9Z9RN25',
				'guest_name'=>'Bob',
				'price'=>47536,
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-03',
				'number_of_guests'=>1,
				'number_of_beds'=>1,
				'message_thread_id'=>404797563
			],
			[
    			'confirmation_code'=>'NRH4G8MQ5Y',
				'guest_name'=>'木村',
				'price'=>8745937,
				'checkin'=>'2017-12-04',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>5,
				'number_of_beds'=>3,
				'message_thread_id'=>4043389356
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_blocked_calendar_should_skip_getting_bookings_with_option_off()
    {
    	$this->markTestIncomplete('This test has not been implemented yet. Blocked data needed.');
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-02",
					"nights"=>1,
					"number_of_guests"=>1,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"NRH4G8MQ5Y",
					"start_date"=>"2017-12-04",
					"nights"=>10,
					"number_of_guests"=>5,
					"thread_id"=>4043389356,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>8745937,
					"payout_price_in_host_currency"=>8745937,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"木村",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMC9Z9RN25',
				'guest_name'=>'Bob',
				'price'=>47536,
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-03',
				'number_of_guests'=>1,
				'number_of_beds'=>1,
				'message_thread_id'=>404797563
			],
			[
    			'confirmation_code'=>'NRH4G8MQ5Y',
				'guest_name'=>'木村',
				'price'=>8745937,
				'checkin'=>'2017-12-04',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>5,
				'number_of_beds'=>3,
				'message_thread_id'=>4043389356
			],
    	]);
    }

    /** @test */
    public function airbnb_normal_processing_with_legitimate_reservations_and_external_calendar_and_blocked_should_correctly_get_bookings()
    {
    	$this->markTestIncomplete('This test has not been implemented yet. all types of data needed.');
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"HMC9Z9RN25",
					"start_date"=>"2017-12-02",
					"nights"=>1,
					"number_of_guests"=>1,
					"thread_id"=>404797563,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>47536,
					"payout_price_in_host_currency"=>47536,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"Bob",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],
			[
				"date"=>"2017-12-03",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-04",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>[
					"confirmation_code"=>"NRH4G8MQ5Y",
					"start_date"=>"2017-12-04",
					"nights"=>10,
					"number_of_guests"=>5,
					"thread_id"=>4043389356,
					"guest_checkin_at"=>null,
					"host_currency"=>"JPY",
					"status"=>"accepted",
					"formatted_host_base_price"=>"¥ 53846",
					"host_payout_formatted"=>"¥ 56939",
					"localized_payout_price"=>8745937,
					"payout_price_in_host_currency"=>8745937,
					"guest"=>[
						"id"=>149144520,
						"full_name"=>"木村",
						"location"=>"Earth, Milky Way",
						"picture_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_x_medium",
						"thumbnail_url"=>"https://a0.muscache.com/im/pictures/user/3d05677a-0c67-47ad-828d-d882835d5c08.jpg?aki_policy=profile_small",
					],
				],

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMC9Z9RN25',
				'guest_name'=>'Bob',
				'price'=>47536,
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-03',
				'number_of_guests'=>1,
				'number_of_beds'=>1,
				'message_thread_id'=>404797563
			],
			[
    			'confirmation_code'=>'NRH4G8MQ5Y',
				'guest_name'=>'木村',
				'price'=>8745937,
				'checkin'=>'2017-12-04',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>5,
				'number_of_beds'=>3,
				'message_thread_id'=>4043389356
			],
    	]);
    }



    //////////////////////// BOOKINGCOM ////////////////////////

    /** @test */
    public function airbnb_normal_processing_with_external_calendar_booking_com_should_correctly_receive_bookings()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "401 Vita",
					"notes"=> "to jo (bookingcom) - by Hostaway Phone: 09044380262 \nNumber of Guests: 8 \nPayout sum: 49200 \nNights: 4 \nChannel: bookingcom \n - by Hostaway"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals([
    		[
    			'confirmation_code'=>'2017-12-02to jo',
				'guest_name'=>'to jo',
				'checkin'=>'2017-12-02',
				'checkout'=>'2017-12-06',
				'number_of_guests'=>8,
				'number_of_beds'=>4,
				'price'=>49200,
				'message_thread_id'=>null,
			],
    	],$processed_bookings);
    }

    /** @test */
    public function airbnb_normal_processing_with_external_calendar_booking_com_first_item_should_not_receive_bookings()
    {
		$client = new mockGuzzleHttp(json_encode(["operations"=>[["response"=>["calendar_days"=>[
			[
				"date"=>"2017-12-02",
				"available"=>false,
				"external_calendar"=>[
					"name"=> "401 Vita",
					"notes"=> "to jo (bookingcom) - by Hostaway Phone: 09044380262 \nNumber of Guests: 2 \nPayout sum: 49200 \nNights: 4 \nChannel: bookingcom \n - by Hostaway"
				],
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,
			],
			[
				"date"=>"2017-12-01",
				"available"=>false,
				"external_calendar"=>null,
				"group_id"=>"reservation:460575467",
				"notes"=>null,
				"reservation"=>null,

			],

			]]]]])
			);
    	$responseBody = $this->airbnb->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processing = $this->airbnb->processBookingsFromDays();
    	$this->assertTrue($processing);
    	$processed_bookings = $this->airbnb->getBookings();
    	PHPUnitTestCase::assertEquals([

    	],$processed_bookings);
    }

}
