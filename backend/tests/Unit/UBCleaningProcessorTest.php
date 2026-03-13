<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Objects\UBCleaningProcessor;

class UBCleaningProcessorTest extends TestCase
{
	public function setUp() {
		parent::setUp();
		$this->location  = factory( \App\Location::class )->create();
	}

    /** @test */
    public function no_cleaning_should_create_cleaning()
    {
    	$cleaning = [
            'location_id'=>$this->location->id,
            'cleaning_date'=>'2018-01-01',
        ];
        $processor = new UBCleaningProcessor($cleaning,null);
        $processor->forbidEmail();

		$processor->process();

		$this->assertDatabaseHas('cleanings', $cleaning);

    }

    /** @test */
    public function existing_cleaning_should_update_cleaning()
    {
    	$cleaning = [
            'location_id'=>$this->location->id,
            'cleaning_date'=>'2018-01-01',
        ];
        $this->location  = factory( \App\Cleaning::class )->create($cleaning);
        $cleaning_updated = [
            'location_id'=>$this->location->id,
            'cleaning_date'=>'2018-01-02',
        ];
        $processor = new UBCleaningProcessor($cleaning,$cleaning_updated['cleaning_date']);
        $processor->forbidEmail();

		$processor->process();

		$this->assertDatabaseHas('cleanings', $cleaning_updated);
		$this->assertDatabaseMissing('cleanings', $cleaning);

    }
}
