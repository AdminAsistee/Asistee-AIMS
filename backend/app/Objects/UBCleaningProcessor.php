<?php

namespace App\Objects;

use App\Cleaning;
use App\User;
use App\Notifications\EmailCleaningChange;

class UBCleaningProcessor {
	public $cleaning;
	public $update_to;
	public $system_cleaning;
	public $error;
	public $emailKyoka;
public $output_file;

	/**
	 * TestMail constructor.
	 *
	 * @param $data
	 */
	public function __construct( $cleaning , $update_to , $output_file="") {
		$this->cleaning = $cleaning;
		$this->update_to = !empty($update_to) ? $update_to : $cleaning['cleaning_date'];
		$this->system_cleaning = null;
		$this->error = null;
		$this->updated = false;
		$this->created = false;
		$this->emailKyoka = true;
		$this->output_file = $output_file;
	}

	public function forbidEmail(){ $this->emailKyoka = false; }

	/**
	 * Perform the Draw and Update Booking root logic.
	 *
	 * @return $this
	 */
	public function process(){
		$cleanings = Cleaning::where([
            'location_id'=>$this->cleaning['location_id'],
            'cleaning_date'=>$this->cleaning['cleaning_date'],
        ]);
        if($cleanings->count() > 1){
            $this->error = ">1 Cleaning";
        return false;
        } elseif ($cleanings->count() > 0) {
            $this->system_cleaning = $cleanings->get()[0];
            $this->system_cleaning->cleaning_date = $this->update_to;
            $lastUpdated = $this->system_cleaning->updated_at->toDateTimeString();
            $this->system_cleaning->save();

            if(!is_null($this->system_cleaning->cleaner)){
            	if($this->cleaning['cleaning_date'] != $this->update_to 
            		&& !empty($this->update_to)
            		&& $this->emailKyoka
            	){
\Storage::append($this->output_file, ">> SENDING-EMAIL[Cleaner-Notification]" . PHP_EOL);
            		$this->system_cleaning->cleaner->notify( new EmailCleaningChange( $this->system_cleaning , $this->cleaning['cleaning_date'] ));
            		User::where('email','Aiko@Asistee.com')->get()[0]->notify( new EmailCleaningChange( $this->system_cleaning , $this->cleaning['cleaning_date'] ));
            	}
            }
            $this->updated = true;
        } else{
            //DNE, create
            $this->system_cleaning = Cleaning::create([
            	'location_id'=>$this->cleaning['location_id'],
            	'cleaning_date'=>$this->update_to,
            ]);
            $this->created = true;
        }
	}

	public function updated(){
		return $this->updated;
	}
	public function created(){
		return $this->created;
	}
	public function errored(){
		return !is_null($this->error);
	}
	public function get_error(){
		return $this->error;
	}

	public function get_cleaning_results(){
		return ['cleaning_id'=>$this->system_cleaning->id,
				'cleaning_date'=>$this->system_cleaning->cleaning_date,
				'cleaning_location_id'=>$this->system_cleaning->location->id,
				'cleaning_location_name'=>$this->system_cleaning->location->building_name . ' ' . $this->system_cleaning->location->room_number,
				'update_to'=>$this->update_to,
				'error'=>$this->error,
				'updated'=>$this->updated,
				'created'=>$this->created,];
	}
}
