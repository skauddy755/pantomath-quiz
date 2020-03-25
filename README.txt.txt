As compared to the v6 folder...
The challenge model has been changed in this version (v7)

Here instead of "by" and "against" (inside challenge schema) being a mixed Schema types ( i.e., {} ),
They are treated as String Schema types... Stroring only the username of the "by" and "against" user

Thought:
 	At any point of time later...
	The user ("by" and "against") can be accessed using,

		User.find({username: ---}, function(err, item){...});