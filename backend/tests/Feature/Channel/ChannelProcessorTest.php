<?php
// Channel Processor Unit test that ensures proper function of the ChannelProcessor object.
namespace Tests\Feature\Channel;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Channels\ChannelProcessor;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;
use App\Listing;
use App\Location;
use App\Booking;
use App\Cleaning;

// Mock mockAbstractChannel object where the methods that return the actual response of a call to a channel instead
// return what is given to it. This allows us to create and use a Normal channel object ... Probably is actually better to use a mock channel object instead
class mockAbstractChannel {
	private $return;
	public function __construct($return){$this->return = $return;}
	public function getPulledBookings(){ return $this->return; }
}

// TODO : tests for Insert / update integrity . Same rules for current BookingController 
// should (but do not currently) apply here.

class ChannelProcessorTest extends TestCase
{
	public function setUp() {
        parent::setUp();
        $this->channelProcessor = new ChannelProcessor();
        $this->date1 = '2018-01-01';
        $this->date2 = '2018-03-01';
        $this->listing_id = 1;
        // Setup default Bookings:
        $this->listing  = factory( Listing::class )->create();
        $this->location  = factory( Location::class )->create();
        $this->location->listings()->save( $this->listing );
        $this->booking1 = factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
        	'confirmation_code'=>'HMC9Z9RN25',
        	'checkin'=>'2018-01-15',
			'checkout'=>'2018-02-01',
			'guests'=>10,
			'beds'=>8,] 
		);
		$this->booking2 = factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
			'confirmation_code'=>'RQGT8541NP',
        	'checkin'=>'2018-02-01',
			'checkout'=>'2018-02-05',
			'guests'=>4,
			'beds'=>4,] 
		);
		$this->booking3 = factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
			'confirmation_code'=>'QWZ451F1LV',
        	'checkin'=>'2018-02-10',
			'checkout'=>'2018-02-15',
			'guests'=>5,
			'beds'=>4,] 
		);
		$this->booking4 = factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
			'confirmation_code'=>'JRWB8410BK',
        	'checkin'=>'2018-02-20',
			'checkout'=>'2018-02-22',
			'guests'=>1,
			'beds'=>1,] 
		);
    }

    /** @test */
    public function base_case_with_no_bookings_and_no_pulls_should_pass()
    {
        //pre-condition
        $localDate1='2020-01-01';
        $localDate2='2020-02-01';
        $booking_list = [
        	// Nothing here.
        ];
        //perform test
        $return = $this->channelProcessor->updateListingFromPull($booking_list,$this->listing,$localDate1,$localDate2);
        //post-conditions
        PHPUnitTestCase::assertEquals(['listing'=>$this->listing,
			'start_date'=>$localDate1,
			'end_date'=>$localDate2,
			'created_bookings'=>[],
			'updated_bookings'=>[],
			'deleted_bookings'=>[],
			'created_cleanings'=>[],
			'updated_cleanings'=>[],
			'deleted_cleanings'=>[],
		],$return);
    }

    // Adding booking should create booking and cleaning
    // NOTE :: Intentionally leaving out cleaning in this test. Ultimately this logic should be extracted
    // ::::::: to a object (booking or helper) that checks user preferences, suspention status, etc when
    // ::::::: inserting a new booking to determine whether to create a cleaning or not.
    /** @test */
    public function normal_case_with_single_new_booking_should_properly_insert_booking()
    {
        //pre-condition
        $booking_list = [
        	[
    			'confirmation_code'=>'NRH4G8MQ5Y',
				'guest_name'=>'木村',
				'price'=>8745937,
				'checkin'=>'2018-01-04',
				'checkout'=>'2018-01-14',
				'number_of_guests'=>20,
				'number_of_beds'=>15,
				'message_thread_id'=>4043389356
			],
        ];
        //perform test
        $return = $this->channelProcessor->updateListingFromPull($booking_list,$this->listing,$this->date1,$this->date2);
        //post-conditions
        $should_be_created_booking = Booking::make([
					'confirmation_code'=>'NRH4G8MQ5Y',
					'checkin'=>'2018-01-04',
					'checkout'=>'2018-01-14',
					'guests'=>20,
					'beds'=>15,
					'message_thread_id'=>4043389356,
				]
			);
  //       PHPUnitTestCase::assertEquals(['listing'=>$this->listing,
		// 	'start_date'=>$this->date1,
		// 	'end_date'=>$this->date2,
		// 	'created_bookings'=>[
		// 		$should_be_created_booking,
		// 	],
		// 	'updated_bookings'=>[],
		// 	'deleted_bookings'=>[],
		// 	'created_cleanings'=>[],
		// 	'updated_cleanings'=>[],
		// 	'deleted_cleanings'=>[],
		// ],$return);
		$this->assertDatabaseHas('bookings', [
				'confirmation_code'=>'NRH4G8MQ5Y',
				'checkin'=>'2018-01-04 00:00:00',
				'checkout'=>'2018-01-14 00:00:00',
				'guests'=>20,
				'beds'=>15,
				// 'message_thread_id'=>4043389356
		]);
		// TODO :: Improve Price check (TODO WITHIN PRICE :: Total Method)
		$booking = $return['created_bookings'][0];
		PHPUnitTestCase::assertEquals($booking->price->total,8745937);
    }


    // Modified booking should edit individual details.
    // Beds should not be automatically modified.
    /** @test */
    public function normal_case_with_updated_fields_should_update_properly()
    {
        //pre-condition
        factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
			'confirmation_code'=>'NRH4G8MQ5Y',
			'checkin'=>'2018-01-04',
			'checkout'=>'2018-01-14',
			'guests'=>10,
			'beds'=>8,
			'price_id'=>factory('App\Price')->create(['total'=>2985734,
				'percentage'=>false])->id,
			'guest_id'=>factory('App\User')->create(['name'=>'鈴木',
				'type'=>'guest',
				'email'=>'suzuki@gmail.com'])->id,] 
		);
        $booking_list = [
        	[
    			'confirmation_code'=>'NRH4G8MQ5Y', 
				'guest_name'=>'鈴木', // Not automatically updated
				'price'=>3490000,
				'checkin'=>'2018-01-03',
				'checkout'=>'2018-01-14',
				'number_of_guests'=>11,
				'number_of_beds'=>9, // Not automatically updated
				'message_thread_id'=>4043389356
			],
        ];
        //perform test
        $return = $this->channelProcessor->updateListingFromPull($booking_list,$this->listing,$this->date1,$this->date2);
        //post-conditions
		$this->assertDatabaseHas('bookings', [
				'confirmation_code'=>'NRH4G8MQ5Y',
				'checkin'=>'2018-01-03 00:00:00',
				'checkout'=>'2018-01-14 00:00:00',
				'guests'=>11,
				'beds'=>8,
				// 'message_thread_id'=>4043389356
		]);
		$this->assertDatabaseMissing('bookings', [
				'confirmation_code'=>'NRH4G8MQ5Y',
				'checkin'=>'2018-01-04 00:00:00',
				'checkout'=>'2018-01-14 00:00:00',
				'guests'=>10,
				'beds'=>8,
				// 'message_thread_id'=>4043389356
		]);
		// NOTE :: Works only on SINGLE-NODE price
		$booking = $return['updated_bookings'][0];
		PHPUnitTestCase::assertEquals($booking->price->total,3490000);
    }

    // Modified booking checkout should move cleaning (if exists)
    /** @test */
    public function normal_case_with_updated_checkout_should_update_cleaning()
    {
        //pre-condition
        // Need booking on our listing
        factory( Booking::class )->create( ['listing_id'=>$this->listing->id,
			'confirmation_code'=>'NRH4G8MQ5Y',
			'checkin'=>'2018-01-04',
			'checkout'=>'2018-01-14',
			'guests'=>10,
			'beds'=>5,
			'price_id'=>factory('App\Price')->create(['total'=>34897539,
				'percentage'=>false])->id,
			'guest_id'=>factory('App\User')->create(['name'=>'鈴木',
				'type'=>'guest',
				'email'=>'suzuki@gmail.com'])->id,] 
		);
		// need locations for listing:
		$second_location = factory( Location::class )->create();
		$second_location->listings()->save( $this->listing );
		// need cleanings for each location:
		factory( Cleaning::class )->create( [
			'location_id'=>$this->location->id,
			'cleaning_date'=>'2018-01-14',
		] );
		factory( Cleaning::class )->create( [
			'location_id'=>$second_location->id,
			'cleaning_date'=>'2018-01-14',
		] );
        $booking_list = [
        	[
    			'confirmation_code'=>'NRH4G8MQ5Y', 
				'guest_name'=>'鈴木', // Not automatically updated
				'price'=>30000,
				'checkin'=>'2018-01-04',
				'checkout'=>'2018-01-12',
				'number_of_guests'=>11,
				'number_of_beds'=>9, // Not automatically updated
				'message_thread_id'=>4043389356
			],
        ];
        //perform test
        $return = $this->channelProcessor->updateListingFromPull($booking_list,$this->listing,$this->date1,$this->date2);
        //post-conditions
		$this->assertDatabaseHas('bookings', [
				'confirmation_code'=>'NRH4G8MQ5Y',
				'checkin'=>'2018-01-04 00:00:00',
				'checkout'=>'2018-01-12 00:00:00',
				'guests'=>11,
				'beds'=>5,
				// 'message_thread_id'=>4043389356
		]);
		// NOTE :: Works only on SINGLE-NODE price
		$booking = $return['updated_bookings'][0];
		PHPUnitTestCase::assertEquals($booking->price->total,30000);

		$this->assertDatabaseMissing('cleanings', [
			'location_id'=>$this->location->id,
			'cleaning_date'=>'2018-01-14',
		]);
		$this->assertDatabaseMissing('cleanings', [
			'location_id'=>$second_location->id,
			'cleaning_date'=>'2018-01-14',
		]);
		$this->assertDatabaseHas('cleanings', [
			'location_id'=>$this->location->id,
			'cleaning_date'=>'2018-01-12',
		]);
		$this->assertDatabaseHas('cleanings', [
			'location_id'=>$second_location->id,
			'cleaning_date'=>'2018-01-12',
		]);
    }

    // Non-existent item should be ( delete / marked for deletion)
    /** @test */
    public function normal_case_deleted_booking_should_soft_remove_and_cascade_booking_and_cleanings()
    {
        $this->markTestIncomplete('Deletion has not been implemented yet.');
    }
}
