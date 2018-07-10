<!-- 
.. title: Policy Gradient Methods: Part 1
.. slug: policy-gradient-methods-part-1
.. date: 2017-03-01 22:03:39 UTC+01:00
.. tags: 
.. category: 
.. link: 
.. description: 
.. type: text
-->

A few months ago, I attended the NIPS tutorial on Policy Optimization given by Pieter Abbeel and John Schulman hoping to better follow along all the new and exciting Policy Gradient based papers that were coming out and getting to be State of the Art (SOTA) on a number of benchmarks. It started out well but I soon got lost in the math. Here's my attempt at looking through all of these methods again and try to understand them.

First, what's the whole idea behind them? Rather than computing a value function (like we did in the previous post that covered Value Functions) and using that to compute a policy $\pi$, we directly try to learn the policy. Well, cool! Why did we need to bother with the Value functions if we could just learn the policy directly? It turns out that Policy Gradient Methods are *much* harder to train well and hence not as popular as Value Function based methods. However, this seems set to change with a lot of great methods coming out with some very impressive results.

There's certain cases where approximating the Action-Value Function is a lot simpler than estimating a Policy. For others, it's a lot easier to estimate the policy directly.  Policy Gradient methods are capable of learning Stochastic policies which Action-Value based methods are not. This is crutial in games of imperfect information (where you can't fully observe everything) like a game of poker. 

The reason I found Policy Gradient methods so hard to grasp initially is because we no longer "tell" the function approximator exactly what the value it should predict is as in the case of Value Function based methods. Instead we always tell it to adjust the action predicted towards something that gives it a more reward. Put another way, it changes from a supervised learning method to an optimization method. 

Now, the distinction is still rather subtle. We still calculate a cumulative reward measure (A value function perhaps) for both methods but we don't use it to pick an action for the Policy Gradient methods. We only use it during training in order to tweak the probability some action is to be taken. 

