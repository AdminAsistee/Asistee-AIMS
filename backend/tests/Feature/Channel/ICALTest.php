<?php

namespace Tests\Feature\Channel;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Channels\ChannelAbstract;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;

class mockGuzzleHttp2 {
	private $return;
	private $status_code;
	public function __construct($return,$status_code=200){$this->return = $return;$this->status_code=$status_code;}
	public function request(){ return $this;}
	public function getBody(){ return $this;}
	public function getContents(){ return $this->return;}
	public function getStatusCode(){ return $this->status_code;}
}

class ICALTest extends TestCase
{
     public function setUp() {
        parent::setUp();
        $this->ical = ChannelAbstract::getChannelObject(2);
        $this->default_date1='2017-12-01';
        $this->default_date2='2018-01-01';
        $this->default_listing_channel_id='';
        $this->default_authenticaiton_parameters = '';
        // Use this to test private functions. Make them public at first to test, then skip tests and the method is made private for production
        // $this->markTestSkipped('Testing that a markTestSkipped function call in the constructor will skip an entire file.');
        // Use this for unimplemented tests.
        // $this->markTestIncomplete('This test has not been implemented yet.');
    }

        /** @test */
    public function ICAL_can_get_and_process_data()
    {
		$client = new mockGuzzleHttp2("BEGIN:VCALENDAR\nPRODID;X-RICAL-TZSOURCE=TZINFO:-\/\/Airbnb Inc\/\/Hosting Calendar 0.8.8\/\/EN\nCALSCALE:GREGORIAN\nVERSION:2.0\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20161220\nDTSTART;VALUE=DATE:20161214\nUID:io58vepcfy2z-7wklfhqzx61v@airbnb.com\nDESCRIPTION:CHECKIN: 12\/13\/2016\\nCHECKOUT: 12\/20\/2016\\nNIGHTS: 7\\nPHONE: \n +86 186 0127 9060\\nEMAIL: (no email alias available)\\nPROPERTY: COZY STU\n DIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Xiaofeng Yin (BHMW24)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171205\nDTSTART;VALUE=DATE:20171125\nUID:io58vepcfy2z--ez8txrmzvakr@airbnb.com\nDESCRIPTION:CHECKIN: 11\/25\/2017\\nCHECKOUT: 12\/05\/2017\\nNIGHTS: 10\\nPHONE:\n  +65 9880 3183\\nEMAIL: kelly-q4wezvvok3le1pgb@guest.airbnb.com\\nPROPERTY\n : COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Kelly Kwek (HMNWTDJZ3C)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171209\nDTSTART;VALUE=DATE:20171205\nUID:io58vepcfy2z-xbwajnj53z4v@airbnb.com\nDESCRIPTION:CHECKIN: 12\/05\/2017\\nCHECKOUT: 12\/09\/2017\\nNIGHTS: 4\\nPHONE: \n +62 818 379 787\\nEMAIL: meliza-rbq2zmrbscjiqfer@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Meliza Budihardjo (HMASQDQFYY)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171214\nDTSTART;VALUE=DATE:20171210\nUID:io58vepcfy2z--fltshbw3lqtf@airbnb.com\nDESCRIPTION:CHECKIN: 12\/10\/2017\\nCHECKOUT: 12\/14\/2017\\nNIGHTS: 4\\nPHONE: \n +86 134 0204 7688\\nEMAIL: user-hlgkk2s9zn77hfsn@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:佳颖 岑 (HMZ3CTKFCP)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171221\nDTSTART;VALUE=DATE:20171215\nUID:io58vepcfy2z-lo1755nnk993@airbnb.com\nDESCRIPTION:CHECKIN: 12\/15\/2017\\nCHECKOUT: 12\/21\/2017\\nNIGHTS: 6\\nPHONE: \n +1 (289) 600-9819\\nEMAIL: paulandvan-o1w8kx17ehusutkm@guest.airbnb.com\\n\n PROPERTY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Paul And Vanessa Craven (HMNFWJ2D5X)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171226\nDTSTART;VALUE=DATE:20171221\nUID:io58vepcfy2z--plpcaw9u9uz3@airbnb.com\nDESCRIPTION:CHECKIN: 12\/21\/2017\\nCHECKOUT: 12\/26\/2017\\nNIGHTS: 5\\nPHONE: \n +86 133 2298 4687\\nEMAIL: user-mxk6syr1xyffl3x2@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:嘉诚 盛 (HM3SPEQBFE)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20180103\nDTSTART;VALUE=DATE:20171227\nUID:io58vepcfy2z--1sqk8sesu02x@airbnb.com\nDESCRIPTION:CHECKIN: 12\/27\/2017\\nCHECKOUT: 01\/03\/2018\\nNIGHTS: 7\\nPHONE: \n +86 137 0302 2337\\nEMAIL: xinyi-prmrqhxr7hln943m@guest.airbnb.com\\nPROPE\n RTY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Xinyi Zhang (HMYQMF82WB)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20170822\nDTSTART;VALUE=DATE:20170820\nUID:3ue1zsq6jv0b-igij56rq71kv@airbnb.com\nSUMMARY:Not available\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20180514\nDTSTART;VALUE=DATE:20180504\nUID:3ue1zsq6jv0b-ytr9dt35d5nt@airbnb.com\nSUMMARY:pour Cyril\\, see fb conv\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20181215\nDTSTART;VALUE=DATE:20180612\nUID:3ue1zsq6jv0b--t0p9tnmi2lar@airbnb.com\nSUMMARY:Not available\nEND:VEVENT\nEND:VCALENDAR\n"
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertTrue($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_with_empty_string_return_should_fail()
    {
		$client = new mockGuzzleHttp2(""
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_malformed_response_should_fail()
    {
		$client = new mockGuzzleHttp2("BEGIN:VCALnnENDAR\nPRODID;X-RICAL-TZSOURCE=TZINFO:-\/\/Airbnb Inc\/\/Hosting Calendar 0.8.8\/\/EN\nCALSCALE:GREGORIAN\nVERSION:2.0\nBEGINK:VEVKENT\nDTEND;VALUE=DATE:20171214\nDTSTART;VALUE=DATE:20171210\nUID:io58vepcfy2z--fltshbw3lqtf@airbnb.com\nDESCRIPTION:CHECKIN: 12\/10\/2017\\nCHECKOUT: 12\/14\/2017\\nNIGHTS: 4\\nPHONE: \n +86 134 0204 7688\\nEMAIL: user-hlgkk2s9zn77hfsn@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMAARY:佳颖 岑 (HMZ3CTKFCP)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VCALENDAR\n"
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_with_invalid_status_code_should_fail_401()
    {
		$client = new mockGuzzleHttp2(json_encode(['error'=>['key'=>'value']]),401
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_with_invalid_status_code_should_fail_403()
    {
		$client = new mockGuzzleHttp2(json_encode(['error'=>['key'=>'value']]),403
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_with_invalid_status_code_should_fail_500()
    {
		$client = new mockGuzzleHttp2(json_encode(['error'=>['key'=>'value']]),500
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    }

    /** @test */
    public function ICAL_get_date_definitions_success_with_no_bookings_should_pass()
    {
		$client = new mockGuzzleHttp2("BEGIN:VCALENDAR\nPRODID;X-RICAL-TZSOURCE=TZINFO:-\/\/Airbnb Inc\/\/Hosting Calendar 0.8.8\/\/EN\nCALSCALE:GREGORIAN\nVERSION:2.0\nEND:VCALENDAR\n"
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$this->assertFalse($responseBody);
    	// ICAL parser object creation will be successfully created whether the the input is malformed, or the input is wellformed with zero bookings, with the results being the same. As there is no (easy) way to determine malformation vs legitimate emptiness, the requirements will change to that such that ICAL must have at least 1 booking, otherwise zero bookings or malformation will throw an error.
    	// $this->assertTrue($responseBody);
    	// $processed_bookings = $this->ical->getBookings();
    	// PHPUnitTestCase::assertEquals($processed_bookings, [
    		// nothing here
    	// ]);
    }

    /** @test */
    public function ical_normal_processing_with_single_booking_returns_expected_booking()
    {
		$client = new mockGuzzleHttp2("BEGIN:VCALENDAR\nPRODID;X-RICAL-TZSOURCE=TZINFO:-\/\/Airbnb Inc\/\/Hosting Calendar 0.8.8\/\/EN\nCALSCALE:GREGORIAN\nVERSION:2.0\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171214\nDTSTART;VALUE=DATE:20171210\nUID:io58vepcfy2z--fltshbw3lqtf@airbnb.com\nDESCRIPTION:CHECKIN: 12\/10\/2017\\nCHECKOUT: 12\/14\/2017\\nNIGHTS: 4\\nPHONE: \n +86 134 0204 7688\\nEMAIL: user-hlgkk2s9zn77hfsn@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:佳颖 岑 (HMZ3CTKFCP)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nEND:VCALENDAR\n"
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processed_bookings = $this->ical->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMZ3CTKFCP',
				'guest_name'=>'佳颖 岑',
				'price'=>null,
				'checkin'=>'2017-12-10',
				'checkout'=>'2017-12-14',
				'number_of_guests'=>null,
				'number_of_beds'=>null,
				'message_thread_id'=>null
			],
    	]);
    }

    /** @test */
    public function ical_normal_processing_with_two_bookings_and_one_not_available_returns_expected_booking()
    {
		$client = new mockGuzzleHttp2("BEGIN:VCALENDAR\nPRODID;X-RICAL-TZSOURCE=TZINFO:-\/\/Airbnb Inc\/\/Hosting Calendar 0.8.8\/\/EN\nCALSCALE:GREGORIAN\nVERSION:2.0\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171209\nDTSTART;VALUE=DATE:20171205\nUID:io58vepcfy2z-xbwajnj53z4v@airbnb.com\nDESCRIPTION:CHECKIN: 12\/05\/2017\\nCHECKOUT: 12\/09\/2017\\nNIGHTS: 4\\nPHONE: \n +62 818 379 787\\nEMAIL: meliza-rbq2zmrbscjiqfer@guest.airbnb.com\\nPROPER\n TY: COZY STUDIO ★ 3MIN TO YAMANOTE LINE\\n\nSUMMARY:Meliza Budihardjo (HMASQDQFYY)\nLOCATION:COZY STUDIO ★ 3MIN TO YAMANOTE LINE\nEND:VEVENT\nBEGIN:VEVENT\nDTEND;VALUE=DATE:20171222\nDTSTART;VALUE=DATE:20171220\nUID:3ue1zsq6jv0b-igij56rq71kv@airbnb.com\nSUMMARY:Not available\nEND:VEVENT\nEND:VCALENDAR\n"
			);
    	$responseBody = $this->ical->getDateDefinitions($this->default_listing_channel_id,$this->default_date1,$this->default_date2,$this->default_authenticaiton_parameters,$client);
    	$processed_bookings = $this->ical->getBookings();
    	PHPUnitTestCase::assertEquals($processed_bookings, [
    		[
    			'confirmation_code'=>'HMASQDQFYY',
				'guest_name'=>'Meliza Budihardjo',
				'price'=>null,
				'checkin'=>'2017-12-05',
				'checkout'=>'2017-12-09',
				'number_of_guests'=>null,
				'number_of_beds'=>null,
				'message_thread_id'=>null
			],
    	]);
    }

}
