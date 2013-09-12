//***************************************************************************
/**
* AppJack - The Web Application JavaScript and CSS Kit
*
* @package		AppJack
* @author 		Christian J. Clark
* @copyright	Copyright (c) Christian J. Clark
* @license		http://www.gnu.org/licenses/lgpl-3.0.txt
* @link			http://www.emonlade.net/appjack/
* @version		0.5.1
* @updated		Started: 4/23/2013, Updated: 9/12/2013
**/
//***************************************************************************

//--------------------------------------------------
// Jesus Christ, Son of God, Our Savior
//--------------------------------------------------
// John 14 (https://www.bible.com/bible/111/jhn.14.niv)
// John 8:12 (https://www.bible.com/bible/111/jhn.8:12.niv)
// John 13:34-35 (https://www.bible.com/bible/111/jhn.13.34-35.niv)
// Matthew 22:36-40 (https://www.bible.com/bible/111/mat.22.36-40.niv)
//--------------------------------------------------

$(document).ready(function()
{

	//======================================================
	// Select and Go
	//======================================================
	if ( $("select.select-and-go").length ) {
		$(".select-and-go").change(function() {
			window.location = $(this).val();
		});
	}

	//======================================================
	// Select Input with Add New Ability
	//======================================================
	if ( $("select.with-add-new").length ) {
		$('select.with-add-new').change(function() {
			var this_val = $(this).val();
			var this_name = $(this).attr('name');
			if (this_val == '[+]') {
				$('input[name="new_' + this_name + '"]').show();
			}
			else {
				$('input[name="new_' + this_name + '"]').hide();
			}
		});
	}
});

//**************************************************************************
//**************************************************************************
// Functions
//**************************************************************************
//**************************************************************************

//=====================================================================
//=====================================================================
// Print Array Function
//=====================================================================
//=====================================================================
function print_array(arr, depth)
{
	if (!depth) { depth = 0; }
	var output = '';
	var tabs = '';

	//----------------------------------------
	// Tabs
	//----------------------------------------
	for (x = 0; x < depth; x++) { tabs += "\t"; }

	//----------------------------------------
	// Process Each Element
	//----------------------------------------
	for (var i in arr) {
		if (arr[i] instanceof Array || arr[i] instanceof Object) {
			output += tabs + '[' + i + '] => ' + print_array(arr[i], depth + 1) + "\n";
		}
		else {
			output += tabs + '[' + i + '] => ' + arr[i] + "\n";
		}
	}

	if (depth) { return "\n" + output; }
	else { alert(output); }
}

//=====================================================================
//=====================================================================
// AJAX Transaction Function
//=====================================================================
//=====================================================================
function ajax_trans(url, params, actions)
{
	$.ajax({
		type: "POST",
		url: url,
		data: params,
		dataType: 'text',
		timeout: 30000,
		success: function(data) {

			//=================================================================
			// Extract Return Code / Data
			//=================================================================
			var split_point = data.indexOf(":");
			if (split_point != -1) {
				var return_code = $.trim(data.substr(0, split_point));
				if (return_code) { return_code = return_code.toLowerCase(); }
				var return_data = $.trim(data.substr(split_point + 1));
			}
			else {
				return true;
			}

			//=================================================================
			// Set Possible Actions and Corresponding Return Values
			//=================================================================
			var possible_actions = {
				'success' 	: true,
				'saved' 	: true,
				'opened'	: true,
				'disabled'	: false,
				'debug'		: false,
				'failed'	: false,
				'error'		: false
			};

			//=================================================================
			// Check for Passed Action Functions
			//=================================================================
			var return_val = true;
			for (var pa in possible_actions) {
				if (actions.hasOwnProperty(pa)) {
					actions[pa](return_data);
					return_val = possible_actions[pa];
					return possible_actions[pa];
				}
			}

			//=================================================================
			// Default Actions
			//=================================================================

			//-----------------------------------------
			// Debug
			//-----------------------------------------
			if (return_code == 'debug') {
				alert('The following debug output was returned: ' + return_data);
				return false;
			}

			//=================================================================
			// Return Value
			//=================================================================
			return return_val;

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log('An error has occurred and the current action was not completed. (' + errorThrown + ')');
			return false;
		}
	});
}

//=====================================================================
//=====================================================================
// Clean URL Function
//=====================================================================
//=====================================================================
function cleanURL(url, keep_qs, ending_slash)
{
	//-----------------------------------------------------
	// Parameter Defaults
	//-----------------------------------------------------
	keep_qs = (typeof keep_qs !== 'undefined') ? (true) : (false);
	ending_slash = (typeof ending_slash !== 'undefined') ? (false) : (true);	

	//-----------------------------------------------------
	// Remove Query String Parameters
	//-----------------------------------------------------
	if (!keep_qs) {
		var split_point = url.indexOf("?");
		if (!split_point) {
			split_point = url.indexOf("&");
		}

		if (split_point > -1) {
			url = url.substr(0, split_point);
		}
	}

	//-----------------------------------------------------
	// Add Beginning Forward Slash
	//-----------------------------------------------------
	if (url.charAt(0) != '/') {
		url = '/' + url;
	}

	//-----------------------------------------------------
	// Remove Trailing Hash
	//-----------------------------------------------------
	if (url.charAt(url.length - 1) == '#') {
		url = url.substring(0, url.length - 1);
	}

	//-----------------------------------------------------
	// Add Trailing Forward Slash
	//-----------------------------------------------------
	if (url.charAt(url.length - 1) != '/') {
		url += '/';
	}

	return url;
}

//=====================================================================
//=====================================================================
// Sort Object Function
//=====================================================================
//=====================================================================
function sortObject(obj, sortFunc)
{
	var tuples = [];
	for (var key in obj) { tuples.push([key, obj[key]]); }

	if (typeof(sortFunc) == 'function') {
		tuples.sort(function(o1, o2) {
			return sortFunc(o1, o2);
		});	  
	}
	else {
		tuples.sort(function(a, b) {
		    a = a[1];
		    b = b[1];
		    return a < b ? -1 : (a > b ? 1 : 0);
		});
	}

	return tuples;
}
