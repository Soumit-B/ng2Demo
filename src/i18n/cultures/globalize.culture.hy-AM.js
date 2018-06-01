/*
 * Globalize Culture hy-AM
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

Globalize = window.GlobalizeParser;

Globalize.addCultureInfo( "hy-AM", "default", {
	name: "hy-AM",
	englishName: "Armenian (Armenia)",
	nativeName: "Հայերեն (Հայաստան)",
	language: "hy",
	numberFormat: {
		currency: {
			pattern: ["-n $","n $"],
			symbol: "դր."
		}
	},
	calendars: {
		standard: {
			"/": ".",
			firstDay: 1,
			days: {
				names: ["Կիրակի","Երկուշաբթի","Երեքշաբթի","Չորեքշաբթի","Հինգշաբթի","ՈՒրբաթ","Շաբաթ"],
				namesAbbr: ["Կիր","Երկ","Երք","Չրք","Հնգ","ՈՒր","Շբթ"],
				namesShort: ["Կ","Ե","Ե","Չ","Հ","Ո","Շ"]
			},
			months: {
				names: ["Հունվար","Փետրվար","Մարտ","Ապրիլ","Մայիս","Հունիս","Հուլիս","Օգոստոս","Սեպտեմբեր","Հոկտեմբեր","Նոյեմբեր","Դեկտեմբեր",""],
				namesAbbr: ["ՀՆՎ","ՓՏՎ","ՄՐՏ","ԱՊՐ","ՄՅՍ","ՀՆՍ","ՀԼՍ","ՕԳՍ","ՍԵՊ","ՀՈԿ","ՆՈՅ","ԴԵԿ",""]
			},
			AM: null,
			PM: null,
			patterns: {
				d: "dd.MM.yyyy",
				D: "d MMMM, yyyy",
				t: "H:mm",
				T: "H:mm:ss",
				f: "d MMMM, yyyy H:mm",
				F: "d MMMM, yyyy H:mm:ss",
				M: "d MMMM"
			}
		}
	}
});

}( this ));
