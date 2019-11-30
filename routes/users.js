var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {	
	// fetch and sort users collection by id in descending order
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'User List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		age: '',
		email: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('sem', 'Sem is required').notEmpty()          
	req.assert('sub', 'Subject is required').notEmpty()  
	req.assert('isa1', 'ISA1 is required').notEmpty()  
	req.assert('isa2', 'ISA2 is required').notEmpty()  
	req.assert('lab', 'Lab is required').notEmpty()  
	req.assert('total', 'Total is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			sem: req.sanitize('sem').escape().trim(),
			sub: req.sanitize('sub').escape().trim(),
			isa1:req.sanitize('isa1').escape().trim(),
			isa2:req.sanitize('isa2').escape().trim(),
			lab:req.sanitize('lab').escape().trim(),
			total:req.sanitize('total').escape().trim(),
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('user/add', {
					title: 'Add New Assessment',
					sem: user.sem,
					sub: user.sub,
					isa1: user.isa1,
					isa2:user.isa2,
					lab:user.lab,
					total:user.total					
				})
			} else {				
				req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/users')
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New User',
					name: '',
					age: '',
					email: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New Assessment',
            sem: req.body.sem,
			sub: req.body.sub,
			isa1: req.body.isa1,
			isa2: req.body.isa2,
			lab: req.body.lab,
			total: req.body.total
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('user/edit', {
				title: 'Edit User', 
				//data: rows[0],
				id: result[0]._id,
				sem: result[0].sem,
				sub: result[0].sub,
				isa1: result[0].isa1,
				isa2: result[0].isa2,
				lab: result[0].lab,
				total: result[0].total
					
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('sem', 'Sem is required').notEmpty()          
	req.assert('sub', 'Subject is required').notEmpty()  
	req.assert('isa1', 'ISA1 is required').notEmpty()  
	req.assert('isa2', 'ISA2 is required').notEmpty()  
	req.assert('lab', 'Lab is required').notEmpty()  
	req.assert('total', 'Total is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			sem: req.sanitize('sem').escape().trim(),
			sub: req.sanitize('sub').escape().trim(),
			isa1:req.sanitize('isa1').escape().trim(),
			isa2:req.sanitize('isa2').escape().trim(),
			lab:req.sanitize('lab').escape().trim(),
			total:req.sanitize('total').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					sem: req.body.sem,
					sub: req.body.sub,
					isa1: req.body.isa1,
					isa2:req.body.isa2,
					lab:req.body.lab,
					total:req.body.total

				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
				
				// render to views/user/edit.ejs
				/*res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			sem: req.body.sem,
			sub: req.body.sub,
			isa1: req.body.isa1,
			isa2: req.body.isa2,
			lab: req.body.lab,
			total: req.body.total
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list page
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			// redirect to users list page
			res.redirect('/users')
		}
	})	
})

module.exports = app
