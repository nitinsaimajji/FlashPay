const {
    Op
} = require("sequelize");
const sequelize = require('sequelize');
const Customer = require('../models/customer');
const Bank=require('../models/bank')
const Transaction=require('../models/transaction');
//login:

module.exports.login = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    return res.render('signin', {
        title: "Login"
    });
}


//register:

module.exports.register = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    return res.render('signup', {
        title: "Register"
    });
}


//create : 

module.exports.create = (req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('error','Password Mismatch');
        return res.redirect('back');
    } else {
        return Customer.findOne({
                where: {
                    email: req.body.email
                },
                raw: true
            })
            .then(user => {
                if (user) {
                    req.flash('error','Email already exists');
                    return res.redirect('back');
                } else {
                    return Customer.findOne({
                            where: {
                                phoneNo: req.body.phoneNo
                            },
                            raw: true
                        })
                        .then(user => {
                            if (user) {
                                req.flash('error','Phone No already exists');
                                return res.redirect('back');
                            } else {
                                return Customer.create(req.body)
                                    .then(() => {
                                        req.flash('success','Registered');
                                        return res.redirect('sign-in');
                                    })
                                    .catch(err => console.log(err));
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }
};


//update profile :

module.exports.update = (req, res) => {
    const customerId = req.user.id;
    const updatedCustomer = req.body;

    if (updatedCustomer.password !== updatedCustomer.confirmPassword) {
        req.flash('error', 'Password Mismatch');
        console.log("password mismatch");
        return res.redirect('back');
    } else {
        return Customer.findOne({
                where: {
                    email: updatedCustomer.email,
                    id: {
                        [Op.ne]: customerId
                    }
                },
                raw: true
            })
            .then(user => {
                if (user) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('back');
                } else {
                    return Customer.findOne({
                            where: {
                                phoneNo: updatedCustomer.phoneNo,
                                id: {
                                    [Op.ne]: customerId
                                }
                            },
                            raw: true
                        })
                        .then(user => {
                            if (user) {
                                req.flash('error', 'Phone No already exists');
                                return res.redirect('back');
                            } else {
                                return Customer.update(updatedCustomer, {
                                        where: {
                                            id: customerId
                                        }
                                    })
                                    .then(() => {
                                        req.flash('success', 'Updated');
                                        return res.redirect('profile');
                                    })
                                    .catch(err => console.log(err));
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }
}



// payment detailing :

module.exports.pay = async (req, res) => {
    const sender = req.user;
    const details = req.body;
    const amount = req.body.amount;
    try {
        const customer = await Customer.findOne({
            where: {
                phoneNo: details.phoneNo
            }
        });
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        if (sender.account < amount) {
            req.flash('error', `Amount of Rs ${amount} was unsuccessfull due to low balance .`)
        } else {
            customer.account = parseFloat(customer.account) + parseFloat(amount);
            balance = customer.account;
            await customer.save()

            sender.account -= amount;
            balance = sender.account
            await sender.save()
            req.flash('success', `Amount of Rs ${amount} was paid to ${customer.firstName}`)
        }

        await Transaction.create({
            customerId: req.user.id,
            Amount: `${amount}`,
            Description: `paid to ${customer.firstName}`,
            paymentMode: 'Wallet',
            type:'Debited'

        });

        await Transaction.create({
            customerId:customer.id,
            Amount:`${amount}`,
            Description:`recieved from ${sender.firstName}`,
            paymentMode:'Wallet',
            type:'Credited'
        });

        return res.redirect('/user/pay')
    } catch (err) {
        console.error(err);
        return res.send('user.account error').status(500);
    }
};



// Wallet top-up by credit card 


module.exports.topUp = async (req, res) => {
    const sender = req.user;
    const details = req.body;
    const amount = req.body.amount;
    try {
        const bank= await Bank.findOne({
            where: {
                customerId:sender.id
            }
        });

        const customer = await Customer.findOne({
            where: {
                id:sender.id
            }
        })

        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        if (bank.creditAmount < amount) {
            req.flash('error', `Amount of Rs ${amount} was unsuccessfull due to low balance .`)
        } else {
            customer.account = parseFloat(customer.account) + parseFloat(amount);
            balance = customer.account;
            await customer.save()

            bank.creditAmount -= amount;
            balance = bank.creditAmount
            await bank.save()
            req.flash('success', `Top up of  Rs. ${amount} was successfull`)
        }

        await Transaction.create({
            customerId: req.user.id,
            Amount: `${amount}`,
            Description: `Funding Wallet`,
            paymentMode: 'Credit Card',
            type:'Credited'
        });

        return res.redirect('/user/topUp')
    } catch (err) {
        console.error(err);
        return res.send('user.account error').status(500);
    }
};
















// create session : 

module.exports.createSession = (req, res) => {
    req.flash('success', 'Logged In');
    return res.redirect('/');
};

// destroy session:

module.exports.destroySession = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
};