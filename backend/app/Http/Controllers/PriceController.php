<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Price;

// TODO: Validation rules need cleaned up.

class PriceController extends Controller
{

	protected $validationRulesForCreation = [
		// 'parent_id' => 'integer|min:1|exists:prices,id',
		// 'description'    => ['required', 'string' ],
		// 'percentage'     => ['boolean'],
		'total'   => ['numeric'],
	];

	protected $validationRulesForUpdate = [
		'parent_id' => 'integer|min:1|exists:prices,id',
		//custom validator rules moved to app/Rules folder on individual Rules class
		'description'    => ['required', 'string' ],
		'percentage'     => ['boolean'],
		'total'   => ['numeric'],
	];

	protected $validationRulesForDeletion = [];

	protected $updateable = [
		'administrator' => [
			'description',
			'percentage',
			'total',
		]
	];



	public function index() {
		return response( Price::orderBy('id', 'desc')->get(), 200 );
	}

	public function update( Price $price, Request $request ) {
		$user = \Auth::user();
		if ( ! in_array( $user->type, [ 'administrator', 'supervisor' ] ) ) {
			return $this->AuthorizationFailureResponse( 'update', 'Price' );
		}
		$fields = $request->only( $this->updateable['administrator'] );
		if ( $this->validationFails( $fields, $this->validationRulesForUpdate ) ) {
			return $this->validationResponse;
		}
		$price->update( $fields );
		return response( $price->fresh(), 200 );
	}

	public function delete( Price $price ) {
		$user = \Auth::user();
		if ( ! in_array( $user->type, [ 'administrator', 'supervisor' ] ) ) {
			return $this->AuthorizationFailureResponse( 'delete', 'Price' );
		}
		$price->delete();
		return response( [ 'message' => 'Price deleted.' ], 200 );
	}

	public function create(Request $request){
		// return $this->creationFailureResponse( 'Price', 'CREATE DEATH_INATOR_INATOR' );
		if ( $this->validationFails( $request->all(), $this->validationRulesForCreation ) ) {
			return $this->validationResponse;
		}
		if( is_null($request->get( 'total' )) ){
			$structure = collect($request->all());
			///////////////////////////////

			// return $this->creationFailureResponse( 'Price', 'Failed to validate Input Structure: '.$this->validateStructure($structure) );
			///////////////////////////////
			if(!$this->validateStructure($structure)){
				return $this->creationFailureResponse( 'Price', 'Failed to validate Input Structure: '.$structure );
			}
			// $structure = $this->recursePrice($price);
    		$created_price = $this->createFromStructure($structure);
		} else {
			$created_price = Price::create(['description'=>$request->get( 'description' ),'total'=>$request->get( 'total' )]);
		}
    	
    	return $this->creationSuccessResponse( 'Price', $created_price );
    	// $prices->flatten()->where('percentage');
    	// $prices->map(function($item){return ($item instanceof Price) ? $item : []; })->flatten()
    }

    public function show(Price $price){
    	$structure = $this->recursePrice($price);
    	$this->combine($structure);
    	$structure = $this->getPriceBreakdown($price);
    	return $structure;
    	// return $price . " //// " . $priceChildren;
	    // if($priceChildren->count() == 0){ 
	    //     return ['root'=>Price::find($price),
	    //         'children'=>null];}
	    // else{
	    //     return [$this->combine($price)//['root'=>['description'=>$price, 'total'=>$this->combine($price)],
	    //         // 'children'=>$priceChildren->map(function($price){ return $this->show($price); })
	    //     ];
	    // }
    }


    // Private functions for Validation
    // Takes Collection Structure
    private function validateStructure($structure){
    	// return "ARRAY IS: " . get_class($structure);
    	if(get_class($structure) != 'Illuminate\Support\Collection'){return false;}
    	$percentageInRow = 0;
    	for ($i=0; $i < count($structure); $i++) { 
    		// Validate Root
    		if(!isset($structure[$i]['root'])){return false;}
    		if(!isset($structure[$i]['root']['description'])){return false;}
    		if(!isset($structure[$i]['root']['total'])){return false;}
    		if(!is_numeric($structure[$i]['root']['total'])){return false;}
    		if(isset($structure[$i]['root']['percentage']) && 
    			!empty($structure[$i]['root']['percentage'])){
    				if($structure[$i]['root']['total'] >= 1 || $structure[$i]['root']['total'] <= 0){return false;}
    				$percentageInRow += $structure[$i]['root']['total'];
    		}
    		// Validate Children
    		if(!is_array($structure[$i]['children'])){
    			if(!empty($structure[$i]['children'])){return false;} // << WHEN TEST FAILS CHANGE THIS TO EMPTY
    		} else {
    			if(!$this->validateStructure(collect($structure[$i]['children']))){return false;}
    		}
    	}
    	if($percentageInRow > 1) {return false;} 
    	return true;
    }

    // Private functions for Creation

    private function createFromStructure($structure,$parent_id=null){
    	for ($i=0; $i < $structure->count(); $i++) {
    		$description = $structure[$i]['root']['description'];
    		$total = $structure[$i]['root']['total'];
    		$percentage = isset($structure[$i]['root']['percentage']) ? $structure[$i]['root']['percentage'] : false;
    		$created_price = Price::create( ['description'=>$description,'total'=>$total,'percentage'=>$percentage,'parent_id'=>$parent_id] );
    		if(!empty($structure[$i]['children'])){ // << WHEN TEST FAILS CHANGE THIS TO EMPTY
    			$this->createFromStructure(collect($structure[$i]['children']),$created_price->id);
    		}
    	}
    	return $created_price;
    }

    // Private functions for viewing / processing

    private function recursePrice(Price $price) {
	    $priceChildren = $price->children;
	    if($priceChildren->count() == 0){ 
	        return ['root'=>$price,
	            'children'=>null];}
	    else{
	        return ['root'=>$price,
	            'children'=>$priceChildren->map(function($price){ 
	                return $this->recursePrice(Price::find($price->id)); 
	            })];
	    }
	}

	// NOTE: Gets ***** structure ***** created from recursePrice function
	private function combine($price_root){
		if($price_root['children']->count() == 0){ return $price_root['root']->total; }

		$totalNumber = 0;
	    $totalPercentage = 0;

	    for ($i=0; $i < $price_root['children']->count(); $i++) { 
	    	if(is_null($price_root['children'][$i]['children'])){
	    		if($price_root['children'][$i]['root']->percentage){
	    			$totalPercentage += $price_root['children'][$i]['root']->total;
	    		} else {
	    			$totalNumber += $price_root['children'][$i]['root']->total;
	    		}
	    	} else {
	    		if($price_root['children'][$i]['children']->flatten()->filter()->where('percentage',false)->count() == 0){
	    				if($price_root['children'][$i]['root']->percentage){
	    					$totalPercentage += $price_root['children'][$i]['root']->total;	
	    				} else {
	    					$totalNumber += $price_root['children'][$i]['root']->total;	
	    				}
	    				
	    		} else {
	    			$totalNumber += $this->combine($price_root['children'][$i]);
	    		}
	    	}
	    }
	    $totalAmount = $totalNumber / (1 - $totalPercentage);
	    $price_root['root']->update( ['total'=>$totalAmount,'percentage'=>false] );
	    return $totalAmount;
	}

	// Assumes Numbers are already pre-populated correctly
	private function getPriceBreakdown(Price $price,$total_parameter=null){
		$priceChildren = $price->children;
		$total_use = (float)(($price->percentage) ? ($price->total * $total_parameter) : $price->total);
		$root = ['description'=>$price->description,'total'=>$total_use];
		if($price->percentage) { $root['percentage'] = $price->total; }

	    if($priceChildren->count() == 0){ 
	        return ['root'=>$root,
	            'children'=>null];
	    }else{
	    	// if($price->percentage) { $total_for_percentage = $total_parameter : $price->total}
	    	$total_for_percentage = ($price->percentage) ? $total_use : $price->total;
	        return ['root'=>$root,
	            'children'=>$priceChildren->map(function($price) use ($total_for_percentage){ 
	                return $this->getPriceBreakdown(Price::find($price->id),$total_for_percentage); 
	            })];
	    }
	}


}
